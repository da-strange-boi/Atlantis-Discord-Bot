const _ = require("lodash")

const huntCoolDown = 15000
const battleCoolDown = 15000
const praycurseCoolDown = 300000
const owoCoolDown = 10000
const dropCoolDown = 30000

const userTimeouts = {}

exports.run = async (bot, message) => {
  if (!message.member) return
  if (message.author.bot && message.author.id != "408785106942164992") return

  // Guild ban check
  message.member.guild.members.forEach(member => {
    if (bot.botBannedUsers.includes(member.id)) {
      message.member.guild.leave()
    }
  })

  // User just mentioning the bot
  if (message.content.replace("!", "") == `<@${bot.user.id}>`) {
    if (bot.database) {
      bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
        if (err) bot.log("error", err)

        const prefix = guilddata.prefix == "" ? "a!" : guilddata.prefix
        bot.createMessage(message.channel.id, `Hello there ***${message.author.username}***, my prefix ${prefix == "a!" ? "is `a!`" : `for **${message.channel.guild.name}** is \`${prefix}\``}`)
      })
    }
  }

  // User message deletion in selected channels
  if (bot.database) {
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
  }

  messageContent = message.content.toLowerCase().replace(/\s/g, "")
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

          if (userdata.hunt) {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`hunt\` cooldown has passed! :bow_and_arrow:`).then(sentMessage => {
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

          if (userdata.battle) {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`battle\` cooldown has passed! :crossed_swords:`).then(sentMessage => {
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
        let whichEmoji = messageContent.startsWith("owopray") ? "<:epray:698234994967052348>" : "<:curse:698235155482935387> "
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

          if (userdata.owo) {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`owo\` cooldown has passed! <:owo:698235134964531272>`).then(sentMessage => {
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
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`drop\` cooldown has passed! <:owo:698235134964531272>`).then(sentMessage => {
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