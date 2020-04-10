// Hey maxi im watching you 👀
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

  // add times to muteTimes.json to save just in case
  if (makeNew) {
    bot.database.HuntBot.insertOne({
      userID: huntbotUser.id,
      timeout: huntbotTimeout
    })

    if (!_.has(memoryOfAddedUsers, message.author.id)) {
      memoryOfAddedUsers[message.author.id] = {}
    }
    if (_.has(memoryOfAddedUsers[message.author.id], "hb")) {
      if (memoryOfAddedUsers[message.author.id].hb) return
    }
    memoryOfAddedUsers[message.author.id].hb = true

  }

  // make sure when the bot starts up it doesn't remind twice
  if (memoryOfAddedUsers[message.author.id].hb) return

  let timeoutTime = huntbotTimeout - Date.now()
  setTimeout(() => {

    // delete the mute timeout from the file
    bot.database.HuntBot.findOne({userID: huntbotUser.id}, (err, userHuntbot) => {
      if (err) bot.log("error", err)

      if (huntbotUser.id == userHuntbot.userID) {
        bot.database.HuntBot.deleteOne({ userID: huntbotUser.id })
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
    memoryOfAddedUsers[message.author.id].hb = false
  }, timeoutTime)
}
