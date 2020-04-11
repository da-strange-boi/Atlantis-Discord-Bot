// Hey maxi im watching you 👀
const ms = require("parse-ms")
exports.run = async (bot) => {
  bot.registerCommand("stats", async (message, args) => {

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
      await bot.checkUserAndGuild(message)

      if (userdata && userdata.stats) {
        const hbTime = ms(userdata.stats.totalHuntbotTime)
        const statsEmbed = {
          embed: {
            author: {
              name: `${userStats.username}'s stats`,
              icon_url: userStats.avatarURL
            },
            color: bot.getEmbedColor(bot, message),
            fields: [
              {
                name: "OwO Count",
                value: `\`${userdata.stats.owoCount}\``,
                inline: true
              },
              {
                name: "Hunt Count",
                value: `\`${userdata.stats.huntCount}\``,
                inline: true
              },
              {
                name: "Battle Count",
                value: `\`${userdata.stats.battleCount}\``,
                inline: true
              },
              {
                name: "Pray/Curse Count",
                value: `\`${userdata.stats.praycurseCount}\``,
                inline: true
              },
              {
                name: "Completed Huntbot's",
                value: `\`${userdata.stats.completedHuntbots}\``,
                inline: true
              },
              {
                name: "Total Huntbot Time",
                value: `\`${hbTime.days}D ${hbTime.hours}H ${hbTime.minutes}m\``,
                inline: true
              },
              {
                name: "\u200B",
                value: "\u200B",
                inline: false
              },
              {
                name: "Daily OwO Count",
                value: `\`${userdata.stats.dailyOwoCount}\``,
                inline: true
              },
              {
                name: "Daily Hunt Count",
                value: `\`${userdata.stats.dailyHuntCount}\``,
                inline: true
              },
              {
                name: "Daily Pray/Curse Count",
                value: `\`${userdata.stats.dailyPraycurseCount}\``,
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