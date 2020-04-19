const fs = require("fs")
exports.run = async (bot) => {
  bot.registerCommand("ban", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {
      let userIDToBan = message.mentions[0].id || args[0]
      let banReason = args.splice(1, args.length-1).join(" ")

      console.log(userIDToBan)

      let isUserInGuild = message.member.guild.members.find(member => member.id == userIDToBan) ? true : false

      if (userIDToBan, banReason) {
        const gotUser = await bot.getRESTUser(userIDToBan)
        const banEmbed = {
          embed: {
            author: {
              name: `${gotUser.username}#${gotUser.discriminator}`,
              icon_url: gotUser.avatarURL
            },
            title: `Banned from ${message.member.guild.name}`,
            description: `Reason: \`${banReason}\``,
            color: bot.getEmbedColor(bot, message),
            timestamp: new Date()
          }
        }

        if (isUserInGuild) {
          try {
            await bot.getDMChannel(userIDToBan).then(async channel => {
              await channel.createMessage(`**You have been banned in ${message.member.guild.name}**\nReason: \`${banReason}\``)
            })
          } catch (e) {
            console.log(e.message)
          }
        }

        // if lee sends the message show a gif
        if (message.author.id == "296155961230622720") {
          banEmbed.embed.image = {url:"https://media1.tenor.com/images/3efd6172556b0866d51f20959298ff93/tenor.gif"}
        }
        
        try {
          await message.member.guild.banMember(userIDToBan, 0, banReason)
          await bot.createMessage(message.channel.id, banEmbed)
        } catch (e) {
          await bot.createMessage(message.channel.id, "Bot doesn't have `ban_members` permission OR user has more permissions then the bot")
        }
      } else {
        const errorEmbed = {
          embed: {
            title: "Incorrect Format",
            description: "See `a!help ban`",
            color: bot.getEmbedColor(bot, message),
            timestamp: new Date()
          }
        }
        bot.createMessage(message.channel.id, errorEmbed)
      }
    }
  })
}