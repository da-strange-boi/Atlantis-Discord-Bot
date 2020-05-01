const _ = require("lodash")

const huntCoolDown = battleCoolDown = 15000
const praycurseCoolDown = 300000
const owoCoolDown = 10000
const dropCoolDown = 30000

const userTimeouts = {}

exports.run = async (bot, message) => {
  if (!message.member) return
  if (message.author.bot && message.author.id != "408785106942164992") return

  // User just mentioning the bot
  if (message.content.replace("!", "") == `<@${bot.user.id}>`) {
    if (bot.database) {
      bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
        if (err) bot.log("error", err)

        const prefix = guilddata.prefix == "" ? "a!" : guilddata.prefix
        bot.createMessage(message.channel.id, `Hello there ***${message.author.username}***, my prefix ${prefix == "a!" ? "is `a!`" : `for **${message.channel.guild.name}** is \`${prefix}\``}${bot.checkBannedUsers(message.author.id) ? "\n> __***You are bot banned***__" : ""}`)
      })
    }
  }

  // Guild ban check
  if (bot.checkBannedUsers(message.author.id)) return

  if (bot.database) {
    // User message deletion in selected channels
    bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)

      if (guilddata) {
        if (guilddata.deleteUserMessagesChannels.includes(message.channel.id)) {
          if (!message.author.bot) {
            setTimeout(() => {message.delete("User messages deleted")}, 150)
          }
        }
        if (guilddata.deleteBotMessagesChannels.includes(message.channel.id)) {
          if (message.author.bot) {
            setTimeout(() => {message.delete("Bot messages deleted")}, 150)
          }
        }
        if (guilddata.owoChannel.includes(message.channel.id)) {
          if (message.content.toLowerCase().trim() != "owo") {
            setTimeout(() => {message.delete("Other messages then \"owo\" deleted")}, 150)
          }
        }
        guilddata.delete.forEach(deleteObj => {
          if ((message.channel.id == deleteObj.channel) && (message.content.startsWith(deleteObj.word))) {
            setTimeout(() => {message.delete("Messages started with a word specified in delete")}, 150)
          }
        })
      }
    })

    // Make custom timers work
    await bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      // beginning of mess (needs redefine-ment)
      // to skip go to line: 99
      if (userdata) {
        let userCustoms = userdata.customs
        for (let i = 0; i < userdata.customs.length; i++) {
          if ((userCustoms[i].id == 1 && userCustoms[i] != "") || ((userCustoms[i].id == 2 || userCustoms[i].id == 3) && userCustoms[i] != "" && userCustoms[i].unlocked)) {
            if (userCustoms[i].trigger == "b") {
              if (message.content.startsWith(userCustoms[i].triggerText)) {
                setTimeout(() => {
                  bot.createMessage(message.channel.id, `<@${message.author.id}>, your \`${userCustoms[i].triggerText}\` cooldown has passed!`).then(sentMessage => {
                    setTimeout(async() => {await sentMessage.delete("Custom timer message deleted")}, 5000)
                    return
                  })
                }, userCustoms[i].time)
              }
            } else if (userCustoms[i].trigger == "a") {
              if (message.content.split(" ").includes(userCustoms[i].triggerText)) {
                setTimeout(() => {
                  bot.createMessage(message.channel.id, `<@${message.author.id}>, your \`${userCustoms[i].triggerText}\` cooldown has passed!`).then(sentMessage => {
                    setTimeout(async() => {await sentMessage.delete("Custom timer message deleted")}, 5000)
                    return
                  })
                }, userCustoms[i].time)
              }
            } else if (userCustoms[i].trigger == "e") {
              if (message.content.endsWith(userCustoms[i].triggerText)) {
                setTimeout(() => {
                  bot.createMessage(message.channel.id, `<@${message.author.id}>, your \`${userCustoms[i].triggerText}\` cooldown has passed!`).then(sentMessage => {
                    setTimeout(async() => {await sentMessage.delete("Custom timer message deleted")}, 5000)
                    return
                  })
                }, userCustoms[i].time)
              }
            }
          }
        }
      }
      // ending of mess
    })
  }

  messageContent = message.content.toLowerCase().replace(/\s/g, "")

  // Custom ring reminder for lanre
  if (messageContent.match(/owobuy[1-7]/g)) {
    setTimeout(async() => {
      if (message.author.id == "648741213154836500" /* lanre */) {
        bot.createMessage(message.channel.id, `${bot.emojis.custom.lanre.ring} Lanre, you can buy rings now! uwu ${bot.emojis.custom.lanre.randomKanna[Math.floor(Math.random() * bot.emojis.custom.lanre.randomKanna.length)]}`).then(sentMessage => {
          setTimeout(() => {sentMessage.delete(`Deleted ring reminder for ${message.author.tag}` )}, 5000)
        })
      }
    }, 5000)
  }

  // Reminder for `owo hunt`
  if (messageContent == "owohunt" || messageContent == "owoh" || messageContent == "owocatch") {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        await bot.checkUserAndGuild(message)
        
        if (!_.has(userTimeouts, message.author.id)) {
          userTimeouts[message.author.id] = {}
        }
        if (_.has(userTimeouts[message.author.id], "hunt")) {
          if (userTimeouts[message.author.id].hunt) return
        }
        userTimeouts[message.author.id].hunt = true

        setTimeout(async() => {
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.huntCount":userdata.stats.huntCount+1}})
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.dailyHuntCount":userdata.stats.dailyHuntCount+1}})
          userTimeouts[message.author.id].hunt = false

          // custom messages
          let huntReminderMessage = `<@${message.author.id}>, \`hunt\` cooldown has passed! ${bot.emojis.native.hunt}`
          if (message.author.id == "144052828678127616" /* Kazen */) huntReminderMessage = `<@${message.author.id}>, \`hunt\` dulu kesayangan! ${bot.emojis.custom.kazen}`
          if (message.author.id == "648741213154836500" /* lanre */) huntReminderMessage = `Kanna will help you hunt! ${bot.emojis.custom.lanre.hunt}`

          if (userdata.hunt) {
            bot.createMessage(message.channel.id, huntReminderMessage).then(sentMessage => {
              setTimeout(() => {sentMessage.delete(`Deleted hunt reminder for ${message.author.tag}`)}, 5000)
            })
          }
        }, huntCoolDown)
      }
    })
  }
  // Reminder for `owo battle`
  if (messageContent == "owobattle" || messageContent == "owob" || messageContent == "owofight") {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        await bot.checkUserAndGuild(message)
        
        if (!_.has(userTimeouts, message.author.id)) {
          userTimeouts[message.author.id] = {}
        }
        if (_.has(userTimeouts[message.author.id], "battle")) {
          if (userTimeouts[message.author.id].battle) return
        }
        userTimeouts[message.author.id].battle = true

        setTimeout(async() => {
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.battleCount":userdata.stats.battleCount+1}})
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.dailyBattleCount":userdata.stats.dailyBattleCount+1}})
          userTimeouts[message.author.id].battle = false

          let battleReminderMessage = `<@${message.author.id}>, \`battle\` cooldown has passed! ${bot.emojis.native.battle}`
          if (message.author.id == "524731061180039168" /* zee */) battleReminderMessage = `<@${message.author.id}>, Maus fight ${bot.emojis.custom.zee}`
          if (message.author.id == "648741213154836500" /* lanre */) battleReminderMessage = `Kanna rides into battle with you! Bye bye bad guys! ${bot.emojis.custom.lanre.battle}`

          if (userdata.battle) {
            bot.createMessage(message.channel.id, battleReminderMessage).then(sentMessage => {
              setTimeout(() => {sentMessage.delete(`Deleted battle reminder for ${message.author.tag}` )}, 5000)
            })
          }
        }, battleCoolDown)
      }
    })
  }
  // Reminder for `owo pray/curse`
  if (messageContent.startsWith("owopray") || messageContent.startsWith("owocurse")) {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        await bot.checkUserAndGuild(message)

        if (!_.has(userTimeouts, message.author.id)) {
          userTimeouts[message.author.id] = {}
        }
        if (_.has(userTimeouts[message.author.id], "praycurse")) {
          if (userTimeouts[message.author.id].praycurse) return
        }
        userTimeouts[message.author.id].praycurse = true

        let whichText = messageContent.startsWith("owopray") ? "pray" : "curse"
        let whichEmoji = whichText == "pray" ? bot.emojis.pray : bot.emojis.curse
        setTimeout(async() => {
          userTimeouts[message.author.id].praycurse = false
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.praycurseCount":userdata.stats.praycurseCount+1}})
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.dailyPraycurseCount":userdata.stats.dailyPraycurseCount+1}})
          
          if (userdata.praycurse) {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`${whichText}\` cooldown has passed! ${whichEmoji}`)
          }
        }, praycurseCoolDown)
      }
    })
  }
  // Reminder for owo/uwu
  if (messageContent == "owo" || messageContent == "uwu") {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        await bot.checkUserAndGuild(message)
        
        if (!_.has(userTimeouts, message.author.id)) {
          userTimeouts[message.author.id] = {}
        }
        if (_.has(userTimeouts[message.author.id], "owo")) {
          if (userTimeouts[message.author.id].owo) return
        }
        userTimeouts[message.author.id].owo = true

        setTimeout(async() => {
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.owoCount":userdata.stats.owoCount+1}})
          await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"stats.dailyOwoCount":userdata.stats.dailyOwoCount+1}})
          userTimeouts[message.author.id].owo = false

          let owoReminderMessage = `<@${message.author.id}>, \`owo\` cooldown has passed! ${bot.emojis.owo}`
          if (message.author.id == "144052828678127616" /* Kazen */) owoReminderMessage = `<@${message.author.id}>, \`owo\` dulu kesayangan! ${bot.emojis.custom.kazen2}`
          if (message.author.id == "498480982471737344" /* Floofie */) owoReminderMessage = `<@${message.author.id}>, oh woah there, your owo cooldown’s done`
          if (message.author.id == "648741213154836500" /* lanre */) owoReminderMessage = `\`owo\` cooldown has passed! ${bot.emojis.owo}`

          if (userdata.owo) {
            bot.createMessage(message.channel.id, owoReminderMessage).then(sentMessage => {
              setTimeout(() => {sentMessage.delete(`Deleted owo reminder for ${message.author.tag}`)}, 3000)
            })
          }
        }, owoCoolDown)
      }
    })
  }
  // Reminder for drop/pickup
  if (messageContent.startsWith("owodrop") || messageContent.startsWith("owopick")) {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        await bot.checkUserAndGuild(message)
        
        if (!_.has(userTimeouts, message.author.id)) {
          userTimeouts[message.author.id] = {}
        }
        if (_.has(userTimeouts[message.author.id], "drop")) {
          if (userTimeouts[message.author.id].drop) return
        }
        userTimeouts[message.author.id].drop = true

        setTimeout(async() => {
          userTimeouts[message.author.id].drop = false

          if (userdata.drop) {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`drop\` cooldown has passed! ${bot.emojis.native.drop}`).then(sentMessage => {
              setTimeout(() => {sentMessage.delete(`Deleted drop reminder for ${message.author.tag}`)}, 5000)
            })
          }
        }, dropCoolDown)
      }
    })
  }
  // Reminder for `owo huntbot`
  if (message.author.id == "408785106942164992") {
    if (message.content.match(/\*\*<:[a-z]{4}:[0-9]{18}> \|\*\* `BEEP BOOP. I AM BACK WITH/g)) return
    if (message.content.match(/\*\*<:[a-z]{4}:[0-9]{18}> \|\*\* `BEEP BOOP./g)) {
      let huntBotTime = message.content.split("I WILL BE BACK IN ")[1].split(" ")[0] // 6H2M
      let timeElements = huntBotTime.match(/[0-9][0-9][M|H]{1}|[0-9][M|H]{1}/g)

      let userUsername = message.content.split("BEEP BOOP. `**`").pop().split("`**`, YOU SPENT ")[0]
      let getMember = message.member.guild.members.find(member => member.user.username == userUsername)
      if (!getMember) return

      bot.database.Userdata.findOne({ userID: getMember.id }, async (err, userdata) => {
        if (err) bot.log("error", err)

        if (userdata) {
          await bot.checkUserAndGuild(message)
          if (userdata.huntbot) {
            let timeToComplete = 0

            timeElements.forEach(time => {
              if (time[1] == "M") {
                timeToComplete += parseInt(time[0]) * 60000
              } else if (time[2] == "M") {
                timeToComplete += parseInt(time[0] + time[1]) * 60000
              }
              if (time[1] == "H") {
                timeToComplete += parseInt(time[0]) * 3600000
              } else if (time[2] == "H") {
                timeToComplete += parseInt(time[0] + time[1]) * 3600000
              }
            })
            message.addReaction("⏰")
            require("../handlers/addHBTimes").run(bot, timeToComplete + Date.now(), huntBotTime, getMember.id, getMember, message.channel.id, true)
          }
        }
      })
    }
  }
}