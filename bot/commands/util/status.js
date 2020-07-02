const ms = require('parse-ms')
const si = require('systeminformation')
const version = require('../../../package.json')
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
exports.run = async (bot) => {
  bot.registerCommand('status', async (message, args) => {
    bot.database.Userdata.find({}).toArray(async (err, docsUS) => {
      if (err) bot.log('error', err)

      bot.database.HuntBot.find({}).toArray(async (err, docsHB) => {
        if (err) bot.log('error', err)

        const memory = await si.mem()

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
                name: 'Total Guilds',
                value: `\`${bot.guilds.size}\``,
                inline: true
              },
              {
                name: 'Total Users',
                value: `\`${docsUS.length}\``,
                inline: true
              },
              {
                name: 'Current HuntBot',
                value: `\`${docsHB.length}\``,
                inline: true
              },
              {
                name: 'Uptime',
                value: `\`${uptime.days} days, ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s\``,
                inline: true
              },
              {
                name: 'Version',
                value: `\`${version.version}\``,
                inline: true
              },
              {
                name: 'Memory',
                value: `\`${formatBytes(memory.used)} : ${formatBytes(memory.total)}\``,
                inline: true
              }
            ],
            timestamp: new Date()
          }
        }
        bot.createMessage(message.channel.id, statusEmbed)
      })
    })
  })
}
