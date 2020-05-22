const _ = require("lodash")
exports.run = async (bot) => {
  bot.registerCommand("delete", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return
    if (!await bot.checkBotPermission(message, ["readMessages", "sendMessages"])) return

    bot.database.Guilddata.findOne({ guildID: message.member.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)

      const option = args[0]
      const word = args[1]
      const channel = message.channelMentions[0] || args[2]

      if (!option) {
        const helpEmbed = {
          embed: {
            title: "Delete Help",
            color: bot.getEmbedColor(bot, message),
            description: "***delete*** will delete all messages that match the given channel and message prefix\n\n__**add**__ ~ Add a channel and word to the list\nexample: `a!delete add bot_command #channel`\n\n__**delete**__ ~ Deletes a channel and word from the list\nexample: `a!delete delete word #channel`",
            fields: [

            ],
            timestamp: new Date()
          }
        }

        if (guilddata.delete.length != 0) {
          let dChannels = ""
          guilddata.delete.forEach(deleteObj => {
            if (message.channel.guild.channels.find(channel => channel.id == deleteObj.channel)) {
              dChannels += `<#${deleteObj.channel}> - \`${deleteObj.word}\`\n`
            } else {
              bot.checkAndUpdateCategories(message, "delete", deleteObj.channel)
            }
          })
          helpEmbed.embed.fields.push({name: "Delete", value: dChannels})
        }

        bot.createMessage(message.channel.id, helpEmbed)
      }

      const inputError = (description) => {
        const errorEmbed = {
          embed: {
            title: "Error",
            color: bot.color.red,
            description: description,
            timestamp: new Date()
          }
        }
        return errorEmbed
      }

      // for adding/deleting channels
      if (message.member.permission.has("administrator")) {
        if (args[0] == "add") {
          
          if (!args[1] || !message.channelMentions[0]) return bot.createMessage(message.channel.id, inputError("Please include the channel mention/id"))
          let found = false
          await guilddata.delete.forEach(deleteObj => {
            if ((deleteObj.channel == channel) && (deleteObj.word == word)) {
              found = true
            }
          })
          if (found) return bot.createMessage(message.channel.id, inputError("That entry is already in the list"))

          let updatedList = guilddata.delete
          updatedList.push({channel: channel, word: word})
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.channel.guild.id }, {$set: {"delete":updatedList}})

          const messageEmbed = {
            embed: {
              title: "Success!",
              color: bot.color.green,
              description: `All messages in <#${channel}> will be deleted that begin with \`${word}\``,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, messageEmbed)
        }
        if (args[0] == "delete") {
          if (!args[1] || !message.channelMentions[0]) return bot.createMessage(message.channel.id, inputError("Please include the channel mention"))
          let found = false
          await guilddata.delete.forEach(deleteObj => {
            if ((deleteObj.channel == channel) && (deleteObj.word == word)) {
              found = true
            }
          })
          if (!found) return bot.createMessage(message.channel.id, inputError("That entry is not in the list"))


          let updatedList = guilddata.delete
          _.remove(updatedList, function(n) {
            return _.isEqual(n, {channel:channel, word:word})
          })
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.channel.guild.id }, {$set: {"delete":updatedList}})

          const messageEmbed = {
            embed: {
              title: "Success!",
              color: bot.color.green,
              description: `All messages in <#${channel}> that begin with \`${word}\` will no longer be deleted`,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, messageEmbed)
        }
      }

    })

  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}