const _ = require('lodash')
const battleCoolDown = 15000
const battleTimeouts = {}

// Reminder for `owo battle`
exports.reminder = async (bot, message, messageContent, customPrefix, userdata) => {
  if (messageContent.match(new RegExp(customPrefix.source + (/(battle|b$|fight)/g).source))) {
    if (userdata) {
      if (!_.has(battleTimeouts, message.author.id)) {
        battleTimeouts[message.author.id] = {}
      }
      if (_.has(battleTimeouts[message.author.id], 'battle')) {
        if (battleTimeouts[message.author.id].battle) return
      }
      battleTimeouts[message.author.id].battle = true

      // stats & serverstats update
      await bot.updateUserdataStats('battleCount', message.author.id, userdata)
      if (userdata.stats.guilds[message.channel.guild.id]) {
        await bot.updateUserdataStats('battleCount', message.author.id, userdata, message.channel.guild.id)
      }

      setTimeout(async () => {
        battleTimeouts[message.author.id].battle = false

        let battleReminderMessage = `<@${message.author.id}>, \`battle\` cooldown has passed! ${bot.emojis.native.battle}`
        if (message.author.id === '524731061180039168' /* zee */) battleReminderMessage = `<@${message.author.id}>, Maus fight ${bot.emojis.custom.zee}`
        if (message.author.id === '648741213154836500' /* lanre */) battleReminderMessage = `Kanna rides into battle with you! Bye bye bad guys! ${bot.emojis.custom.lanre.battle}`

        if (userdata.battle) {
          bot.createMessage(message.channel.id, battleReminderMessage).then(sentMessage => {
            setTimeout(() => { sentMessage.delete(`Deleted battle reminder for ${message.author.tag}`) }, 5000)
          })
        }
      }, battleCoolDown)
    }
  }
}
