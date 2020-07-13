const _ = require('lodash')
const owoCoolDown = 10000
const owoTimeouts = {}

// Reminder for owo/uwu
exports.reminder = async (bot, message, messageContent, customPrefix, userdata) => {
  if (messageContent === 'owo' || messageContent === 'uwu' || message.content.match(/.+(?:owo|uwu)\s/g)) {
    if (userdata) {
      if (!_.has(owoTimeouts, message.author.id)) {
        owoTimeouts[message.author.id] = {}
      }
      if (_.has(owoTimeouts[message.author.id], 'owo')) {
        if (owoTimeouts[message.author.id].owo) return
      }
      owoTimeouts[message.author.id].owo = true

      // stats & serverstats update
      userdata.stats.owoCount = userdata.stats.owoCount + 1
      userdata.stats.dailyOwoCount = userdata.stats.dailyOwoCount + 1
      await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { stats: userdata.stats } })
      if (userdata.stats.guilds[message.channel.guild.id]) {
        userdata.stats.guilds[message.channel.guild.id].owoCount = userdata.stats.guilds[message.channel.guild.id].owoCount + 1
        userdata.stats.guilds[message.channel.guild.id].dailyOwoCount = userdata.stats.guilds[message.channel.guild.id].dailyOwoCount + 1
        await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
        await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { stats: userdata.stats } })
      }

      setTimeout(async () => {
        owoTimeouts[message.author.id].owo = false

        let owoReminderMessage = `<@${message.author.id}>, \`owo\` cooldown has passed! ${bot.emojis.owo}`
        if (message.author.id === '144052828678127616' /* Kazen */) owoReminderMessage = `<@${message.author.id}>, \`owo\` dulu kesayangan! ${bot.emojis.custom.kazen2}`
        if (message.author.id === '498480982471737344' /* Floofie */) owoReminderMessage = `<@${message.author.id}>, oh woah there, your owo cooldown’s done`
        if (message.author.id === '648741213154836500' /* lanre */) owoReminderMessage = `\`owo\` cooldown has passed! ${bot.emojis.owo}`

        if (userdata.owo) {
          bot.createMessage(message.channel.id, owoReminderMessage).then(sentMessage => {
            setTimeout(() => { sentMessage.delete(`Deleted owo reminder for ${message.author.tag}`) }, 3000)
          })
        }
      }, owoCoolDown)
    }
  }
}
