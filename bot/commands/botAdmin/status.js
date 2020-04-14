// Hey maxi im watching you 👀
const ms = require("parse-ms")
const package = require("../../../package.json")
exports.run = async (bot) => {
  bot.registerCommand("status", async (message, args) => {
    bot.database.Userdata.find({}).toArray(async(err, docs) => {
      if (err) bot.log("error", err)

      if (await bot.checkPermission(message, "botAdmin")) {
        const uptime = ms(bot.uptime)
        const statusEmbed = {
          embed: {
            title: `${bot.user.username} Status`,
            color: bot.getEmbedColor(bot, message),
            thumbnail: {
              url: bot.user.avatarURL
            },
            fields: [
              {
                name: "Total Guilds",
                value: `\`${bot.guilds.size}\``,
                inline: true
              },
              {
                name: "Total Users",
                value: `\`${docs.length}\``,
                inline: true
              },
              {
                name: "Uptime",
                value: `\`${uptime.days} days, ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s\``,
                inline: true
              },
              {
                name: "Version",
                value: `\`${package.version}\``,
                inline: true
              }
            ],
            timestamp: new Date()
          }
        }
        bot.createMessage(message.channel.id, statusEmbed)
      }
    })
  })
}