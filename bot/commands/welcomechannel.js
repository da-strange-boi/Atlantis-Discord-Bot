exports.run = async (bot) => {
  bot.registerCommand("welcomechannel", async (message, args) => {
    await bot.checkUserAndGuild(message)

    bot.database.Guilddata.findOne({ guildID: message.member.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)

      if (!args[0]) {
        const helpEmbed = {
          embed: {
            title: "Welcome Channel Help",
            color: bot.getEmbedColor(bot, message),
            description: "***welcomechannel*** will send a welcome card once a user joins with server\n\n__**add**__ ~ Add a channel to the category\nexample: `a!welcomechannel add #channel`\n\n__**delete**__ ~ Deletes a channel from the category\nexample: `a!welcomechannel delete #channel`\n\n__**text**__ ~ Sets the text for the welcome card\nexample: `a!welcomechannel text Welcome {user} to {server}!`\n<:blank:689966696244838459>**{user}** ~ A user mention\n<:blank:689966696244838459>**{user_tag}** ~ The users tag\n<:blank:689966696244838459>**{user_username}** ~ The users username\n<:blank:689966696244838459>**{server}** ~ server name",
            timestamp: new Date()
          }
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
          
          if (!args[1] || !message.channelMentions[0]) return bot.createMessage(message.channel.id, inputError("Please include the channel mention"))
          if (guilddata.welcomeChannel.includes(message.channelMentions[0])) return bot.createMessage(message.channel.id, inputError("That channel is already in the list"))
          if (guilddata.welcomeChannel[0] != " ") return bot.createMessage(message.channel.id, inputError("Welcome channel is already set"))

          let updatedList = guilddata.welcomeChannel
          updatedList[0] = message.channelMentions[0]
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.member.guild.id }, {$set: {"welcomeChannel":updatedList}})

          const messageEmbed = {
            embed: {
              title: "Success!",
              color: bot.color.green,
              description: `Welcome card will be sent in ${args[1]}`,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, messageEmbed)
        }
        if (args[0] == "delete") {
          if (!args[1] || !message.channelMentions[0]) return bot.createMessage(message.channel.id, inputError("Please include the channel mention"))
          if (!guilddata.welcomeChannel.includes(message.channelMentions[0])) return bot.createMessage(message.channel.id, inputError("That channel is not in the list"))

          let updatedList = guilddata.welcomeChannel
          updatedList[0] = " "
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.member.guild.id }, {$set: {"welcomeChannel":updatedList}})

          const messageEmbed = {
            embed: {
              title: "Success!",
              color: bot.color.green,
              description: `Welcome card will no longer be sent in ${args[1]}`,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, messageEmbed)
        }
        if (args[0] == "text") {
          if (!args[1]) return bot.createMessage(message.channel.id, inputError("Please include the text to add"))

          let updatedList = guilddata.welcomeChannel
          let updateText = args.splice(1).join(" ")
          if (guilddata.welcomeChannel[1]) {
            updatedList[1] = updateText
          }
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.member.guild.id }, {$set: {"welcomeChannel":updatedList}})

          const welcomechannelTextEmbed = {
            embed: {
              title: "Success!",
              color: bot.color.green,
              description: `Welcome channel text is set to: \n\`${updateText}\``,
              timestamp: new Date()
            }
          }

          bot.createMessage(message.channel.id, welcomechannelTextEmbed)
        }
      }
    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}