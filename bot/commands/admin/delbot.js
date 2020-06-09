const _ = require('lodash')
exports.run = async (bot) => {
  bot.registerCommand('delbot', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    bot.database.Guilddata.findOne({ guildID: message.member.guild.id }, async (err, guilddata) => {
      if (err) bot.log('error', err)

      if (!args[0]) {
        const helpEmbed = {
          embed: {
            title: 'Delete Bot Messages Help',
            color: bot.getEmbedColor(bot, message),
            description: '***delbot*** will delete all bot messages in a given channel\n\n__**add**__ ~ Add a channel to the list\nexample: `a!delbot add #channel`\n\n__**delete**__ ~ Deletes a channel from the list\nexample: `a!delbot delete #channel`',
            fields: [

            ],
            timestamp: new Date()
          }
        }

        if (guilddata.deleteBotMessagesChannels.length === 0) {
          let dChannels = ''
          guilddata.deleteBotMessagesChannels.forEach(channelID => {
            if (message.member.guild.channels.find(channel => channel.id === channelID)) {
              dChannels += `<#${channelID}> `
            } else {
              bot.checkAndUpdateCategories(message, 'deleteBotMessagesChannels', channelID)
            }
          })
          helpEmbed.embed.fields.push({ name: 'Delete Bot Messages Channels', value: dChannels })
        }

        bot.createMessage(message.channel.id, helpEmbed)
      }

      const inputError = (description) => {
        const errorEmbed = {
          embed: {
            title: 'Error',
            color: bot.color.red,
            description: description,
            timestamp: new Date()
          }
        }
        return errorEmbed
      }

      // for adding/deleting channels
      if (message.member.permission.has('administrator')) {
        if (args[0] === 'add') {
          if (!args[1] || !message.channelMentions[0]) return bot.createMessage(message.channel.id, inputError('Please include the channel mention'))
          if (guilddata.deleteBotMessagesChannels.includes(message.channelMentions[0])) return bot.createMessage(message.channel.id, inputError('That channel is already in the list'))

          const updatedList = guilddata.deleteBotMessagesChannels
          updatedList.push(message.channelMentions[0])
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.member.guild.id }, { $set: { deleteBotMessagesChannels: updatedList } })

          const messageEmbed = {
            embed: {
              title: 'Success!',
              color: bot.color.green,
              description: `Bot messages will be deleted in ${args[1]}`,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, messageEmbed)
        }
        if (args[0] === 'delete') {
          if (!args[1] || !message.channelMentions[0]) return bot.createMessage(message.channel.id, inputError('Please include the channel mention'))
          if (!guilddata.deleteBotMessagesChannels.includes(message.channelMentions[0])) return bot.createMessage(message.channel.id, inputError('That channel is not in the list'))

          const updatedList = guilddata.deleteBotMessagesChannels
          _.remove(updatedList, function (n) {
            return n === message.channelMentions[0]
          })
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.member.guild.id }, { $set: { deleteBotMessagesChannels: updatedList } })

          const messageEmbed = {
            embed: {
              title: 'Success!',
              color: bot.color.green,
              description: `Bot messages will no longer be deleted in ${args[1]}`,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, messageEmbed)
        }
      }
    })
  }, {
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
