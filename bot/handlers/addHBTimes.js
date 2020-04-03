const path = require('path')
const fs = require('fs')

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
    const newHuntBotTime = [{ [huntbotUser.id]: huntbotTimeout }]
    const huntbotDataFile = fs.readFileSync(path.join(__dirname, 'huntBot.json'))
    const huntbotData = JSON.parse(huntbotDataFile)
    huntbotData.push(...newHuntBotTime)

    fs.writeFile(path.join(__dirname, 'huntBot.json'), JSON.stringify(huntbotData), 'utf8', err => { bot.log("error", err) })
  }

  let timeoutTime = huntbotTimeout - Date.now()
  setTimeout(() => {

    // delete the mute timeout from the file
    const huntbotDataFile = fs.readFileSync(path.join(__dirname, 'huntBot.json'))
    const huntbotData = JSON.parse(huntbotDataFile)

    for (let i = 0; i < huntbotData.length; i++) {
      if (huntbotUser.id in huntbotData[i]) {
        huntbotData.splice(i, 1)
      }
    }
    fs.writeFile(path.join(__dirname, 'huntBot.json'), JSON.stringify(huntbotData), 'utf8', err => { bot.log("error", err) })

    // Send them the message
    let displayTime
    if (timeString) {
      displayTime = `\n<:blank:689966696244838459> **|** Took \`${timeString}\` to finish`
    } else {
      displayTime = ""
    }
    //huntbotUser
    bot.createMessage(bot.getDMChannel(huntbotUser.id), `<:info:689965598997872673> **|** Your HuntBot is complete!${displayTime}`)
  }, timeoutTime)
}
