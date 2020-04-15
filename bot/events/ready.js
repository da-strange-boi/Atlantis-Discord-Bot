const addHBTimes = require("../handlers/addHBTimes")
const CronJob = require("cron").CronJob
exports.run = async (bot) => {
  bot.log("botOnline")

  setTimeout(async() => {
    // Setting the bots status
    await bot.database.Userdata.find({}).toArray((err, userdata) => {
      if (err) bot.log("error", err)
      bot.editStatus("online", {
        name: `Reminding ${userdata.length} users | a!help`,
        type: 0
      })
    })

    // Setting custom guild prefixes
    await bot.database.Guilddata.find({}).toArray((err, guilddata) => {
      if (err) bot.log("error", err)
      guilddata.forEach(guild => {
        if (guild.prefix != "") {
          bot.registerGuildPrefix(guild.guildID, [guild.prefix, "@mention"])
        }
      })
    })

  }, 4000)

  // get mute user data
  setTimeout(() => {
    bot.database.HuntBot.find({}).toArray(async(err, huntbot) => {
      if (err) bot.log("error", err)

      for (let i = 0; i < huntbot.length; i++) {
        const userID = huntbot[i].userID
        const huntbotTimeout = huntbot[i].timeout

        const userObj = await bot.users.find(user => user.id == userID)
        addHBTimes.run(bot, huntbotTimeout, false, false, userObj, false)
      }
    })
  }, 5000)
}