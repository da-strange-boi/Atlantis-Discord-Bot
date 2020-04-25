const { CronJob } = require("cron")
const DBL = require("dblapi.js")
const BLS = require("botlist.space")
module.exports = async (bot) => {
  const dbl = new DBL(process.env.DBL_TOKEN, {webhookPort: process.env.PORT, webhookAuth: process.env.WEBHOOK_AUTH}, bot)
  const bls = new BLS.Client({id: bot.user.id, botToken: process.env.BLS_TOKEN})

  dbl.on("error", (e) => {
    bot.log("error", e)
  })

  dbl.webhook.on("ready", hook => {
    console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`)

    // when user votes
    dbl.webhook.on("vote", vote => {
      bot.database.Userdata.findOne({ userID: vote.id }, async (err, userdata) => {
        if (err) bot.log("error", err)

        if (userdata) {
          let modifiedCustom = userdata.customs
          for (let i = 0; i < modifiedCustom.length; i++) {
            modifiedCustom[i].unlocked = true
          }
          await bot.database.Userdata.findOneAndUpdate({ userID: vote.id }, {$set: {"custom": modifiedCustom}})
          await bot.database.Userdata.findOneAndUpdate({ userID: vote.id }, {$set: {"lastVote": Date.now()}})
        }
      })
    })

  })

  // Post stats every 30 mins
  new CronJob("0 */30 * * * *", () => {
    dbl.postStats(bot.guilds.size, 0, bot.shards.size)
    bls.postServerCount(bot.guilds.size).catch(err => bot.log("error", err))
    bot.log("statsPosted", `Guilds: ${bot.guilds.size} || Shards: ${bot.shards.size}`)
  }, null, true, "America/New_York").start()

}