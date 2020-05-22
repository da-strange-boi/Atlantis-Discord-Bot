exports.run = async (bot) => {
  bot.registerCommand("prefix", async (message, args) => {
    bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)
      if (bot.checkBannedUsers(message.author.id)) return
      if (!await bot.checkBotPermission(message, ["readMessages", "sendMessages"])) return

      let prefix = args.join(" ").replace("{space}", " ")

      if (prefix.length > 20) return bot.createMessage(message.channel.id, {embed:{title:"Error",color:bot.color.red,description:"Prefix must be less then `20` characters long",timestamp:new Date()}})

      if (!args[0]) {
        const prefixEmbed = {
          embed: {
            title: `Prefix for ${message.channel.guild.name}`,
            color: bot.getEmbedColor(bot, message),
            description: `Current prefix: \`${guilddata.prefix == "" ? "a!" : guilddata.prefix}\``,
            timestamp: new Date()
          }
        }
        await bot.createMessage(message.channel.id, prefixEmbed)
      }

      if (prefix) {
        if (message.member.permission.has("administrator")) {
          bot.database.Guilddata.findOneAndUpdate({ guildID: message.channel.guild.id }, {$set: {"prefix":prefix}})
          bot.registerGuildPrefix(message.channel.guild.id, [prefix, "@mention"])
          const newPrefix = {
            embed: {
              title: `New prefix for ${message.channel.guild.name}`,
              color: bot.getEmbedColor(bot, message),
              description: `New prefix is: \`${prefix}\``,
              timestamp: new Date()
            }
          }
          bot.createMessage(message.channel.id, newPrefix)
        } else {
          return bot.createMessage(message.channel.id, {embed:{title:"Error",color:bot.color.red,description:"Only admins can change the server prefix",timestamp:new Date()}})
        }
      }

    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}