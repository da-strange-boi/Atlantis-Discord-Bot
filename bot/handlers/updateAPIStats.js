const { CronJob } = require("cron")
const DBL = require("dblapi.js")
const BLS = require("botlist.space")
module.exports = async (bot) => {
  const dbl = new DBL(process.env.DBL_TOKEN, {webhookPort: process.env.PORT, webhookAuth: process.env.WEBHOOK_AUTH})
  const bls = new BLS.Client({id: bot.user.id, botToken: process.env.BLS_TOKEN})

  dbl.on("error", (e) => {
    bot.log("error", e)
  })

  // Post stats every 30 mins
  new CronJob("0 */30 * * * *", () => {
    dbl.postStats(bot.guilds.size, 0, bot.shards.size)
    bls.postServerCount(bot.guilds.size).catch(err => bot.log("error", err))
    bot.log("statsPosted", `Guilds: ${bot.guilds.size}`)
  }, null, true, "America/New_York").start()

}