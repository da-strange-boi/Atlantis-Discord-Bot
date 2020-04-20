const { CronJob } = require("cron")
const DBL = require("dblapi.js")
module.exports = async (bot) => {
  const dbl = new DBL(process.env.DBL_TOKEN, {webhookPort: process.env.PORT, webhookAuth: process.env.WEBHOOK_AUTH})

  dbl.on("error", (e) => {
    bot.log("error", e)
  })

  // Post stats every 30 mins
  new CronJob("0 */30 * * * *", () => {
    dbl.postStats(bot.guilds.size, 0, bot.shards.size)
    bot.log("statsPosted", `Guilds: ${bot.guilds.size}`)
  }, null, true, "America/New_York").start()

}