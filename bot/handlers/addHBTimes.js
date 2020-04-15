const _ = require("lodash")
const memoryOfAddedUsers = {}
exports.run = async (bot, huntbotTimeout, timeString, userID, userObj, makeNew) => {
  if (!bot || !huntbotTimeout) bot.log("error", 'addUserHB does not have all the data needed to run!')

  let huntbotUser
  if (userObj) {
    huntbotUser = userObj
  } else {
    huntbotUser =  await bot.users.get(userID)
  }
  
  if (!huntbotUser) return
  await bot.database.Userdata.findOne({userID: huntbotUser.id}, async (err, userdata) => {
    if (err) bot.log("error", err)

    // add times to muteTimes.json to save just in case
    let timeoutTime = huntbotTimeout - Date.now()
    if (makeNew) {
      bot.database.HuntBot.insertOne({
        userID: huntbotUser.id,
        timeout: huntbotTimeout
      })
      await bot.database.Userdata.findOneAndUpdate({ userID: huntbotUser.id }, {$set: {"stats.totalHuntbotTime":userdata.stats.totalHuntbotTime+timeoutTime}})
    }

    if (!_.has(memoryOfAddedUsers, huntbotUser.id)) {
      memoryOfAddedUsers[huntbotUser.id] = {}
    }
    if (_.has(memoryOfAddedUsers[huntbotUser.id], "hb")) {
      if (memoryOfAddedUsers[huntbotUser.id].hb) return
    }
    memoryOfAddedUsers[huntbotUser.id].hb = true

    // make sure when the bot starts up it doesn't remind twice
    if (!memoryOfAddedUsers[huntbotUser.id].hb) return

    setTimeout(async() => {

      // delete the mute timeout from the file
      bot.database.HuntBot.findOne({userID: huntbotUser.id}, async (err, userHuntbot) => {
        if (err) bot.log("error", err)

        if (huntbotUser.id == userHuntbot.userID) {
          bot.database.HuntBot.deleteOne({ userID: huntbotUser.id })
          await bot.database.Userdata.findOneAndUpdate({ userID: huntbotUser.id }, {$set: {"stats.completedHuntbots":userdata.stats.completedHuntbots+1}})
        }
      })

      // Send them the message
      let displayTime
      if (timeString) {
        displayTime = `\n<:blank:689966696244838459> **|** Took \`${timeString}\` to finish`
      } else {
        displayTime = ""
      }
      //huntbotUser
      bot.getDMChannel(huntbotUser.id).then(dmChannel => {
        dmChannel.createMessage(`<:info:689965598997872673> **|** Your HuntBot is complete!${displayTime}`)
      })
      memoryOfAddedUsers[huntbotUser.id].hb = false
    }, timeoutTime)
  })
}
