// Reminder for `owo huntbot`
exports.reminder = async (bot, message) => {
  if (message.author.id === '408785106942164992') {
    let falseReminderRegex = /\*\*<:[a-z]{4}:[0-9]{18}> \|\*\* `BEEP BOOP. I AM BACK WITH/g
    let reminderRegex = /\*\*<:[a-z]{4}:[0-9]{18}> \|\*\* `BEEP BOOP./g
    const userUsername = message.content.split(/( `\*\*`|\|\*\* \*\*`)/).pop().split('`**`, YOU SPENT ')[0]
    if (userUsername.match(/\*\*<(.*?)>/g)) return
    let userUsernameId = await bot.users.find(user => user.username === userUsername)

    if (userUsernameId) {
      userUsernameId = userUsernameId.id
    } else {
      return
    }

    // *•.ˎ[BxW] SmittenKittenˏ.•*
    if (userUsernameId === '325273108418396160') {
      falseReminderRegex = /\*\*<a:(.*?)> \|\*\* `ROSS IS BACK WITH/g
      reminderRegex = /\*\*<a:(.*?)> \|\*\* \*\*`(.*?)`\*\*`, YOU SPENT/g
    }

    // *•.ˎ[BxW] SpotifyBotˏ.•*
    if (userUsernameId === '255750356519223297') {
      falseReminderRegex = /\*\*<a:(.*?)> \|\*\* `SPOTIFY Playlist is ready! I AM BACK WITH/g
      reminderRegex = /\*\*<a:(.*?)> \|\*\* \*\*`(.*?)`\*\*`, YOU SPENT/g
    }

    if (message.content.match(falseReminderRegex)) return
    if (message.content.match(reminderRegex)) {
      const huntBotTime = message.content.split('I WILL BE BACK IN ')[1].split(' ')[0] // 6H2M
      const timeElements = huntBotTime.match(/[0-9][0-9][M|H]{1}|[0-9][M|H]{1}/g)

      const getMember = message.member.guild.members.find(member => member.user.username === userUsername)
      if (!getMember) return

      bot.database.Userdata.findOne({ userID: getMember.id }, async (err, userdata) => {
        if (err) bot.log('error', err)

        if (userdata) {
          await bot.checkUserAndGuild(message)
          if (userdata.huntbot) {
            let timeToComplete = 0

            timeElements.forEach(time => {
              if (time[1] === 'M') {
                timeToComplete += parseInt(time[0]) * 60000
              } else if (time[2] === 'M') {
                timeToComplete += parseInt(time[0] + time[1]) * 60000
              }
              if (time[1] === 'H') {
                timeToComplete += parseInt(time[0]) * 3600000
              } else if (time[2] === 'H') {
                timeToComplete += parseInt(time[0] + time[1]) * 3600000
              }
            })
            message.addReaction('⏰')
            require('../handlers/addHBTimes').run(bot, timeToComplete + Date.now(), huntBotTime, getMember.id, getMember, message.channel.id, true)
          }
        }
      })
    }
  }
}
