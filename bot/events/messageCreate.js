const praycurseCoolDown = 300000
const battleReminder = require('../reminders/battle')
const dropReminder = require('../reminders/drop')
const huntReminder = require('../reminders/hunt')
const huntbotReminder = require('../reminders/huntbot')
const owoReminder = require('../reminders/owo')
const praycurseReminder = require('../reminders/praycurse')

exports.run = async (bot, message) => {
  if (!message.member) return
  if (message.author.bot && message.author.id !== '408785106942164992') return

  // User just mentioning the bot
  if (message.content.replace('!', '') === `<@${bot.user.id}>`) {
    if (bot.database) {
      bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
        if (err) bot.log('error', err)

        const prefix = guilddata.prefix === '' ? 'a!' : guilddata.prefix
        bot.createMessage(message.channel.id, `Hello there ***${message.author.username}***, my prefix ${prefix === 'a!' ? 'is `a!`' : `for **${message.channel.guild.name}** is \`${prefix}\``}${bot.checkBannedUsers(message.author.id) ? '\n> __***You are bot banned***__' : ''}`)
      })
    }
  }

  // Guild ban check
  if (bot.checkBannedUsers(message.author.id)) return

  // message deletion in selected channels (admin commands)
  if (bot.database) {
    bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
      if (err) bot.log('error', err)

      if (guilddata) {
        if (guilddata.deleteUserMessagesChannels.includes(message.channel.id)) {
          if (!message.author.bot) {
            setTimeout(() => { message.delete('User messages deleted') }, 150)
          }
        }
        if (guilddata.deleteBotMessagesChannels.includes(message.channel.id)) {
          if (message.author.bot) {
            setTimeout(() => { message.delete('Bot messages deleted') }, 150)
          }
        }
        if (guilddata.owoChannel.includes(message.channel.id)) {
          if (message.content.toLowerCase().trim() !== 'owo') {
            setTimeout(() => { message.delete('Other messages then "owo" deleted') }, 150)
          }
        }
        guilddata.delete.forEach(deleteObj => {
          if ((message.channel.id === deleteObj.channel) && (message.content.toLowerCase().startsWith(deleteObj.word))) {
            setTimeout(() => { message.delete('Messages started with a word specified in delete') }, 150)
          }
        })
      }
    })

    let userdata

    if (!userdata) {
      await bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdataFromDB) => {
        if (err) bot.log('error', err)

        if (userdataFromDB) {
          userdata = userdataFromDB
        }
      })
    }

    if (userdata) {
      userdata = await JSON.parse(userdata)

      // Custom timers logic
      const userCustoms = userdata.customs
      for (let i = 0; i < userdata.customs.length; i++) {
        if ((userCustoms[i].id === 1 && userCustoms[i] !== '') || ((userCustoms[i].id === 2 || userCustoms[i].id === 3) && userCustoms[i] !== '' && userCustoms[i].unlocked)) {
          if (
            (userCustoms[i].trigger === 'b' && message.content.startsWith(userCustoms[i].triggerText)) ||
            (userCustoms[i].trigger === 'a' && message.content.split(' ').includes(userCustoms[i].triggerText)) ||
            (userCustoms[i].trigger === 'e' && message.content.endsWith(userCustoms[i].triggerText))
          ) {
            setTimeout(() => {
              bot.createMessage(message.channel.id, `<@${message.author.id}>, your \`${userCustoms[i].triggerText}\` cooldown has passed!`).then(sentMessage => {
                if (userCustoms[i].time < praycurseCoolDown) setTimeout(async () => { await sentMessage.delete('Custom timer message deleted') }, userCustoms[i].time > 30000 ? 15000 : 5000)
              })
            }, userCustoms[i].time)
          }
        }
      }

      // adding to server stats
      if (!userdata.stats.guilds[message.channel.guild.id]) {
        const guildStats = userdata.stats.guilds
        guildStats[message.channel.guild.id] = {
          owoCount: 0,
          huntCount: 0,
          battleCount: 0,
          praycurseCount: 0,
          dailyOwoCount: 0,
          dailyHuntCount: 0,
          dailyBattleCount: 0,
          dailyPraycurseCount: 0
        }
        bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { 'stats.guilds': guildStats } })
      }
    }

    const messageContent = message.content.toLowerCase().replace(/\s/g, '')
    const customPrefix = bot.customOwoPrefix[message.channel.guild.id] ? new RegExp(`(owo|${bot.customOwoPrefix[message.channel.guild.id]})`, 'g') : new RegExp('(owo)', 'g')

    await bot.checkUserAndGuild(message)

    // getting reminders
    battleReminder.reminder(bot, message, messageContent, customPrefix, userdata)
    dropReminder.reminder(bot, message, messageContent, customPrefix, userdata)
    huntReminder.reminder(bot, message, messageContent, customPrefix, userdata)
    huntbotReminder.reminder(bot, message)
    owoReminder.reminder(bot, message, messageContent, customPrefix, userdata)
    praycurseReminder.reminder(bot, message, messageContent, customPrefix, userdata)

    // Custom ring reminder for lanre
    if (message.author.id === '648741213154836500' /* lanre */) {
      if (messageContent.match(/owobuy[1-7]/g)) {
        setTimeout(async () => {
          bot.createMessage(message.channel.id, `${bot.emojis.custom.lanre.ring} Lanre, you can buy rings now! uwu ${bot.emojis.custom.lanre.randomKanna[Math.floor(Math.random() * bot.emojis.custom.lanre.randomKanna.length)]}`).then(sentMessage => {
            setTimeout(() => { sentMessage.delete(`Deleted ring reminder for ${message.author.tag}`) }, 5000)
          })
        }, 5000)
      }
    }

    // Get data from atlantis members for website
    // !! this including website has no need to be in the bot,, this will be removed !!
    if (message.channel.guild.id === '667900803528261657' && (message.member.roles.includes('667916293651038228') || message.member.roles.includes('668105514785308682'))) {
      await bot.database.Website.findOne({ userID: message.author.id }, async (err, webUser) => {
        if (err) bot.log('error', err)

        if (!webUser) {
          await bot.database.Website.insertOne({
            userID: message.author.id,
            avatar: message.author.avatar,
            userTag: `${message.author.username}#${message.author.discriminator}`,
            level: message.member.roles.includes('667918448508272691') || message.member.roles.includes('696426968962302023') ? 3 : message.member.roles.includes('667916293651038228') ? 2 : 1,
            nickname: message.member.nick,
            premium: message.member.premiumSince,
            joinedAtlantis: message.member.joinedAt,
            owosPastWeek: 0,
            owosArchive: []
          })
        } else {
          if (message.content.toLowerCase().replace(/\s/g, '') === ('owo' || 'uwu')) {
            await bot.database.Website.findOneAndUpdate({ userID: message.author.id }, { $set: { owosPastWeek: webUser.owosPastWeek + 1 } })
          }
          await bot.database.Website.findOneAndUpdate({ userID: message.author.id }, { $set: { avatar: message.author.avatar } })
          await bot.database.Website.findOneAndUpdate({ userID: message.author.id }, { $set: { userTag: `${message.author.username}#${message.author.discriminator}` } })
          await bot.database.Website.findOneAndUpdate({ userID: message.author.id }, { $set: { level: message.member.roles.includes('667918448508272691') || message.member.roles.includes('696426968962302023') ? 3 : message.member.roles.includes('667916293651038228') ? 2 : 1 } })
          await bot.database.Website.findOneAndUpdate({ userID: message.author.id }, { $set: { nickname: message.member.nick } })
          await bot.database.Website.findOneAndUpdate({ userID: message.author.id }, { $set: { premium: message.member.premiumSince } })
        }
      })
    }
  }
}
