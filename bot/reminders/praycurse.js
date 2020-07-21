const _ = require('lodash')
const praycurseCoolDown = 300000
const praycurseTimeouts = {}

// Reminder for `owo pray/curse`
exports.reminder = async (bot, message, messageContent, customPrefix, userdata) => {
  if (messageContent.match(new RegExp(customPrefix.source + (/(pray|curse)/g).source))) {
    if (userdata) {
      if (!_.has(praycurseTimeouts, message.author.id)) {
        praycurseTimeouts[message.author.id] = {}
      }
      if (_.has(praycurseTimeouts[message.author.id], 'praycurse')) {
        if (praycurseTimeouts[message.author.id].praycurse) return
      }
      praycurseTimeouts[message.author.id].praycurse = true

      // stats
      await bot.updateUserdataStats('praycurseCount', message.author.id, userdata)
      if (userdata.stats.guilds[message.channel.guild.id]) {
        await bot.updateUserdataStats('praycurseCount', message.author.id, userdata, message.channel.guild.id)
      }

      const whichText = messageContent.startsWith('owopray') ? 'pray' : 'curse'
      const whichEmoji = whichText === 'pray' ? bot.emojis.pray : bot.emojis.curse

      setTimeout(async () => {
        praycurseTimeouts[message.author.id].praycurse = false

        let praycurseText = `<@${message.author.id}>, \`${whichText}\` cooldown has passed! ${whichEmoji}`
        if (message.author.id === '648741213154836500' /* lanre */) {
          if (whichText === 'pray') {
            praycurseText = `<@${message.author.id}>, ${bot.emojis.custom.lanre.randomKanna[1]} Lan you're supposed to be cursing, not praying, you hypocrite ${bot.emojis.custom.lanre.angry}`
          } else {
            praycurseText = `<@${message.author.id}>, ${bot.emojis.custom.lanre.pray} Lanny, you can curse Blackblood now! ${bot.emojis.custom.lanre.randomKanna[6]}`
          }
        }
        if (message.author.id === '369996055737008149' /* guap */) {
          if (whichText === 'pray') {
            praycurseText = `<@${message.author.id}>, ${bot.emojis.custom.guap} Prayers up :pray_tone3:999:black_heart: ${bot.emojis.custom.guap}`
          }
        }

        if (userdata.praycurse) {
          bot.createMessage(message.channel.id, praycurseText)
        }
      }, praycurseCoolDown)
    }
  }
}
