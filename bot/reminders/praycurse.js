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
      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { 'stats.praycurseCount': userdata.stats.praycurseCount + 1 } })
      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { 'stats.dailyPraycurseCount': userdata.stats.dailyPraycurseCount + 1 } })
      if (userdata.stats.guilds[message.channel.guild.id]) {
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { [`stats.guilds.${message.channel.guild.id}.praycurseCount`]: userdata.stats.guilds[message.channel.guild.id].praycurseCount + 1 } })
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { [`stats.guilds.${message.channel.guild.id}.dailyPraycurseCount`]: userdata.stats.guilds[message.channel.guild.id].dailyPraycurseCount + 1 } })
      }

      // stats & serverstats update
      userdata.stats.praycurseCount = userdata.stats.praycurseCount + 1
      userdata.stats.dailyPraycurseCount = userdata.stats.dailyPraycurseCount + 1
      await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { stats: userdata.stats } })
      if (userdata.stats.guilds[message.channel.guild.id]) {
        userdata.stats.guilds[message.channel.guild.id].praycurseCount = userdata.stats.guilds[message.channel.guild.id].praycurseCount + 1
        userdata.stats.guilds[message.channel.guild.id].dailyPraycurseCount = userdata.stats.guilds[message.channel.guild.id].dailyPraycurseCount + 1
        await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { stats: userdata.stats } })
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
            praycurseText = `<@${message.author.id}>, ${bot.emojis.custom.lanre.pray} Lanny, you can curse Kanzen now! ${bot.emojis.custom.lanre.randomKanna[6]}`
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
