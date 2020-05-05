exports.run = async (bot) => {
  bot.registerCommand("serverstats", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    let userStats
    if (!args[0]) {
      userStats = message.author
    } else if (message.mentions[0]) {
      userStats = message.mentions[0]
    } else {
      userStats = message.author
    }


    bot.database.Userdata.findOne({ userID: userStats.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata && userdata.stats) {
        const statsEmbed = {
          embed: {
            author: {
              name: `${userStats.username}'s stats in ${message.channel.guild.name}`,
              icon_url: userStats.avatarURL
            },
            color: bot.getEmbedColor(bot, message),
            thumbnail: {
              url: message.channel.guild.iconURL
            },
            fields: [
              {
                name: "OwO Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].owoCount}\``,
                inline: true
              },
              {
                name: "Hunt Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].huntCount}\``,
                inline: true
              },
              {
                name: "Battle Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].battleCount}\``,
                inline: true
              },
              {
                name: "Pray/Curse Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].praycurseCount}\``,
                inline: true
              },
              {
                name: "\u200B",
                value: "\u200B",
                inline: false
              },
              {
                name: "Daily OwO Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].dailyOwoCount}\``,
                inline: true
              },
              {
                name: "Daily Hunt Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].dailyHuntCount}\``,
                inline: true
              },
              {
                name: "Daily Battle Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].dailyBattleCount}\``,
                inline: true
              },
              {
                name: "Daily Pray/Curse Count",
                value: `\`${userdata.stats.guilds[message.channel.guild.id].dailyPraycurseCount}\``,
                inline: true
              }
            ],
            timestamp: new Date()
          }
        }
        bot.createMessage(message.channel.id, statsEmbed)
      }

    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}