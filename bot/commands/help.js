/** @typedef {Eris.Client & getEmbedColor} bot */
exports.run = async (bot) => {
  const addCMD = (embed, name, description) => {
    embed.embed.description += `__**${name}**__ ~ ${description}\n`
  }
  bot.registerCommand("help", async (message, args) => {
    await bot.checkUserAndGuild(message)

    const helpUserEmbed = {
      embed: {
        color: bot.getEmbedColor(bot, message),
        description: "**Support** me on <:kofi:695186691098411049> **[Ko-fi](https://ko-fi.com/dastrangeboi)  |**  Join Atlantis <:pfp:695187609294471188> **[here](https://discord.gg/Ys9pSZs)**\n\n",
      }
    }
    const helpUtilEmbed = {
      embed: {
        color: bot.getEmbedColor(bot, message),
        description: "",
        footer: {

        }
      }
    }
    const helpAdminEmbed = {
      embed: {
        color: bot.getEmbedColor(bot, message),
        description: "",
        footer: {

        }
      }
    }
    // User Command
    addCMD(helpUserEmbed, "hunt", "Toggles the reminder for \`owo hunt\`")
    addCMD(helpUserEmbed, "battle", "Toggles the reminder for \`owo battle\`")
    addCMD(helpUserEmbed, "praycurse", "Toggles the reminder for \`owo pray\` & \`owo curse\`")
    addCMD(helpUserEmbed, "huntbot", "Toggles the reminder for \`owo huntbot\`")
    addCMD(helpUserEmbed, "show", "Shows what is enabled/disabled")
    

    // Util Commands
    helpUtilEmbed.embed.description += "\n***Until Commands***\n\n"
    addCMD(helpUtilEmbed, "atlantis", "Sends an invite link to join Atlantis")
    addCMD(helpUtilEmbed, "invite", "Invite Atlantis bot to your server")

    // Admin Commands
    if (message.member.permission.has("administrator")) {

      helpAdminEmbed.embed.footer.text = "Atlantis Bot, made by `da strange boi#7087` with lots of love!"
      helpAdminEmbed.embed.timestamp = new Date()

      helpAdminEmbed.embed.description += "\n***Admin Commands***\n(run the command as is for more info)\n\n"
      addCMD(helpAdminEmbed, "message", "Shows what channels are in what category below")
      addCMD(helpAdminEmbed, "deleteusermessages", "Deletes user messages in a given channel")
      addCMD(helpAdminEmbed, "deletebotmessages", "Deletes bot messages in a given channel")
      addCMD(helpAdminEmbed, "owochannel", "Deletes all messages expect \"owo\"")
      addCMD(helpAdminEmbed, "welcomechannel", "Display a welcome card to new members in a given channel")
    
      helpAdminEmbed.embed.description += "\nThanks to `pri8000#8266` for the profile picture art!"
    } else {
      helpUtilEmbed.embed.description += "\nThanks to `pri8000#8266` for the profile picture art!"
      helpUtilEmbed.embed.footer.text = "Atlantis Bot, made by `da strange boi#7087` with lots of love!"
      helpUtilEmbed.embed.timestamp = new Date()
    }

    bot.createMessage(message.channel.id, helpUserEmbed).then(() => {
      bot.createMessage(message.channel.id, helpUtilEmbed).then(() => {
        if (message.member.permission.has("administrator")) {
          bot.createMessage(message.channel.id, helpAdminEmbed)
        }
      })
    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}