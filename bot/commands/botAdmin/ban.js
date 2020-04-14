// Hey maxi im watching you 👀
exports.run = async (bot) => {
  bot.registerCommand("ban", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {
      let userIDToBan = args[0]
      let daysToDeleteTheirMessages = args[1]
      let banReason = args.splice(2, args.length-2).join(" ")

      let isUserInGuild = message.member.guild.members.find(member => member.id == userIDToBan) ? true : false

      if (userIDToBan, daysToDeleteTheirMessages, banReason) {
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
          bot.getDMChannel(userIDToBan).then(channel => {
            channel.createMessage(`**You have been banned in ${message.member.guild.name}**\nReason: \`${banReason}\``)
          })
        }
        
        await message.member.guild.banMember(userIDToBan, daysToDeleteTheirMessages, banReason)
        await bot.createMessage(message.channel.id, banEmbed)
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