const _ = require("lodash")
exports.run = async (bot) => {
  bot.registerCommand("message", async (message, args) => {
    await bot.checkUserAndGuild(message)
    bot.database.Guilddata.findOne({ guildID: message.member.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)

      // Message dashboard
      if (message.member.permission.has("administrator")) {

        const messageEmbed = {
          embed: {
            title: "Message Control",
            color: bot.getEmbedColor(bot, message),
            fields: [

            ],
            timestamp: new Date()
          }
        }

        const checkAndUpdateCategories = (msg, category, channelID) => {
          let updatedList = eval(`guilddata.${category}`)
          _.remove(updatedList, function(n) {
            return n == channelID
          })
          return bot.database.Guilddata.findOneAndUpdate({ guildID: msg.member.guild.id }, {$set: {category:updatedList}})
        }

        let hasAddChannelsToCategories = false

        // deleteusermessage
        if (guilddata.deleteUserMessagesChannels.length != 0) {
          let dChannels = ""
          guilddata.deleteUserMessagesChannels.forEach(channelID => {
            if (message.member.guild.channels.find(channel => channel.id == channelID)) {
              dChannels += `<#${channelID}>\n`
            } else {
              checkAndUpdateCategories(message, "deleteUserMessagesChannels", channelID)
            }
          })
          hasAddChannelsToCategories = true
          messageEmbed.embed.fields.push({name: "Delete User Message", value: dChannels})
        }
        // deletebotmessage
        if (guilddata.deleteBotMessagesChannels.length != 0) {
          let dChannels = ""
          guilddata.deleteBotMessagesChannels.forEach(channelID => {
            if (message.member.guild.channels.find(channel => channel.id == channelID)) {
              dChannels += `<#${channelID}>\n`
            } else {
              checkAndUpdateCategories(message, "deleteBotMessagesChannels", channelID)
            }
          })
          hasAddChannelsToCategories = true
          messageEmbed.embed.fields.push({name: "Delete Bot Messages Channels", value: dChannels})
        }
        // owochannel
        if (guilddata.owoChannel.length != 0) {
          let dChannels = ""
          guilddata.owoChannel.forEach(channelID => {
            if (message.member.guild.channels.find(channel => channel.id == channelID)) {
              dChannels += `<#${channelID}>\n`
            } else {
              checkAndUpdateCategories(message, "owoChannel", channelID)
            }
          })
          hasAddChannelsToCategories = true
          messageEmbed.embed.fields.push({name: "OwO Channel", value: dChannels})
        }
        // welcomechannel
        if (guilddata.welcomeChannel[0] != " ") {
          let dChannels = ""
          guilddata.welcomeChannel.forEach(channelID => {
            if (message.member.guild.channels.find(channel => channel.id == channelID)) {
              dChannels += `<#${channelID}>\n\`${guilddata.welcomeChannel[1]}\`\n`
            } else {
              checkAndUpdateCategories(message, "welcomeChannel", channelID)
            }
          })
          hasAddChannelsToCategories = true
          messageEmbed.embed.fields.push({name: "Welcome Channel", value: dChannels})
        }

        if (!hasAddChannelsToCategories) messageEmbed.embed.description = "*No channels are set under any categories*\nSee: `a!deletebotmessages`, `a!owochannel`"
        bot.createMessage(message.channel.id, messageEmbed)
      }
    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}