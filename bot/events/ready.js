const addHBTimes = require("../handlers/addHBTimes")
const fs = require("fs")
const path = require("path")
exports.run = async (bot) => {
  bot.log("botOnline")
  bot.editStatus("online", {
    name: `Join Atlantis here: https://discord.gg/RPHFFpK`,
    type: 0
  })

  // get mute user data
  const huntbotTimesDataFile = fs.readFileSync(path.join(__dirname, '../handlers/huntBot.json'))
  const huntbotTimesData = JSON.parse(huntbotTimesDataFile)

  for (let i = 0; i < huntbotTimesData.length; i++) {
    const userID = Object.keys(huntbotTimesData[i])
    const huntbotTimeout = huntbotTimesData[i][userID]

    const userObj = await bot.users.find(user => user.id == userID)
    addHBTimes.run(bot, huntbotTimeout, false, false, userObj, false)
  }
}