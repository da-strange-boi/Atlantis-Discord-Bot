const addHBTimes = require("../handlers/addHBTimes")
const CronJob = require("cron").CronJob
let checker = 0

const formatNumber = (number) => {
  return Intl.NumberFormat().format(number)
}

exports.run = async (bot) => {
  bot.log("botOnline")

  if (checker === 0) {
    checker++

    if (process.env.DEV === "false") {
      require("../handlers/updateAPIStats")(bot)
    }

    // Setting the bots status
    let updateStatus = new CronJob("0 */30 * * * *", async () => {
      await bot.database.Userdata.find({}).toArray((err, userdata) => {
        if (err) bot.log("error", err)
        if (userdata) {
          bot.editStatus("online", {
            name: `Reminding ${formatNumber(userdata.length)} users | a!help`,
            type: 0
          })
        }
      })
    }, null, true, "America/New_York")
    updateStatus.start()

    await bot.database.Guilddata.find({}).toArray((err, guilddata) => {
      if (err) bot.log("error", err)
      guilddata.forEach(guild => {

        // Setting custom guild prefixes
        if (guild.prefix != "") {
          bot.registerGuildPrefix(guild.guildID, [guild.prefix, "@mention"])
        }

        // Setting custom owo prefixes
        if (guild.owoPrefix != null) {
          bot.customOwoPrefix[guild.guildID] = guild.owoPrefix
        }

      })
    })

    // Add bot banned users
    bot.botBannedUsers = []
    await bot.database.BotBan.find({}).toArray(async(err, users) => {
      if (err) bot.log("error", err)
      users.forEach(user => {
          bot.botBannedUsers.push(user.userID)
      })
    })


    // get mute user data
    await bot.database.HuntBot.find({}).toArray(async(err, huntbot) => {
      if (err) bot.log("error", err)

      for (let i = 0; i < huntbot.length; i++) {
        const userID = huntbot[i].userID
        const channelID = huntbot[i].channelID
        const huntbotTimeout = huntbot[i].timeout

        const userObj = await bot.users.find(user => user.id == userID)
        await addHBTimes.run(bot, huntbotTimeout, false, userID, userObj, channelID, false)
      }
    })
  }
}