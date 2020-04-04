const _ = require("lodash")

const huntCoolDown = 15000
const battleCoolDown = 15000
const praycurseCoolDown = 300000

let userTimeouts = {}

exports.run = async (bot, message) => {
  if (!message.member) return
  if (message.author.bot && message.author.id != "408785106942164992") return

  // TESTING
  if (message.content == "---") {
    bot.emit("guildMemberAdd", message.member.guild, message.member)
  }

  // User message deletion in selected channels
  if (bot.database) {
    bot.database.Guilddata.findOne({ guildID: message.member.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)

      if (guilddata) {
        if (guilddata.deleteUserMessagesChannels.includes(message.channel.id)) {
          if (!message.author.bot) {
            setTimeout(() => {message.delete(`User messages deleted in ${message.channel.name}`)}, 100)
          }
        }
        if (guilddata.deleteBotMessagesChannels.includes(message.channel.id)) {
          if (message.author.bot) {
            setTimeout(() => {message.delete(`Bot messages deleted in ${message.channel.name}`)}, 100)
          }
        }
        if (guilddata.owoChannel.includes(message.channel.id)) {
          if (message.content.toLowerCase().trim() != "owo") {
            setTimeout(() => {message.delete(`Other messages then "owo" deleted in ${message.channel.name}`)}, 100)
          }
        }
      }
    })
  }

  messageContent = message.content.toLowerCase().replace(" ", "")
  // Reminder for `owo hunt`
  if (messageContent == "owohunt" || messageContent == "owoh" || messageContent == "owocatch") {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        if (userdata.hunt) {
          if (!_.has(userTimeouts, message.author.id)) {
            userTimeouts[message.author.id] = {}
          }
          if (_.has(userTimeouts[message.author.id], "hunt")) {
            if (userTimeouts[message.author.id].hunt) return
          }
          userTimeouts[message.author.id].hunt = true

          setTimeout(() => {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`hunt\` cooldown has passed! :trident:`).then(sentMessage => {
              userTimeouts[message.author.id].hunt = false
              setTimeout(() => {sentMessage.delete(`Deleted hunt reminder for ${message.author.tag}`)}, 5000)
            })
          }, huntCoolDown)
        }
      }
    })
  }
  // Reminder for `owo battle`
  if (messageContent == "owobattle" || messageContent == "owob" || messageContent == "owofight") {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        if (userdata.battle) {
          if (!_.has(userTimeouts, message.author.id)) {
            userTimeouts[message.author.id] = {}
          }
          if (_.has(userTimeouts[message.author.id], "battle")) {
            if (userTimeouts[message.author.id].battle) return
          }
          userTimeouts[message.author.id].battle = true

          setTimeout(() => {
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`battle\` cooldown has passed! :trident:`).then(sentMessage => {
              userTimeouts[message.author.id].battle = false
              setTimeout(() => {sentMessage.delete(`Deleted battle reminder for ${message.author.tag}` )}, 5000)
            })
          }, battleCoolDown)
        }
      }
    })
  }
  // Reminder for `owo pray/curse`
  if (messageContent.startsWith("owopray") || messageContent.startsWith("owocurse")) {
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      if (userdata) {
        if (userdata.praycurse) {
          if (!_.has(userTimeouts, message.author.id)) {
            userTimeouts[message.author.id] = {}
          }
          if (_.has(userTimeouts[message.author.id], "praycurse")) {
            if (userTimeouts[message.author.id].praycurse) return
          }
          userTimeouts[message.author.id].praycurse = true

          let whichOne = messageContent.startsWith("owopray") ? "pray" : "curse"
          setTimeout(() => {
            userTimeouts[message.author.id].praycurse = false
            bot.createMessage(message.channel.id, `<@${message.author.id}>, \`${whichOne}\` cooldown has passed! :trident:`)
          }, praycurseCoolDown)
        }
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
            require("../handlers/addHBTimes").run(bot, timeToComplete + Date.now(), huntBotTime, getMember.id, getMember, true)
          }
        }
      })
    }
  }
}