const _ = require('lodash')
const memoryOfAddedUsers = {}
exports.run = async (bot, huntbotTimeout, timeString, userID, userObj, channelID, makeNew) => {
  if (!bot || !huntbotTimeout) bot.log('error', 'addUserHB does not have all the data needed to run!')

  // get the User class
  const huntbotUser = await bot.getRESTUser(userID)

  if (!huntbotUser) return
  await bot.database.Userdata.findOne({ userID: huntbotUser.id }, async (err, userdata) => {
    if (err) bot.log('error', err)

    // If its a new huntbot add it to the DB
    const timeoutTime = huntbotTimeout - Date.now()
    if (makeNew) {
      bot.database.HuntBot.insertOne({
        userID: huntbotUser.id,
        channelID: channelID,
        timeout: huntbotTimeout
      })
      await bot.database.Userdata.findOneAndUpdate({ userID: huntbotUser.id }, { $set: { 'stats.totalHuntbotTime': userdata.stats.totalHuntbotTime + timeoutTime } })
    }

    // Set it that the user has a huntbot set so if the bot restarts it won't set another one
    if (!_.has(memoryOfAddedUsers, huntbotUser.id)) {
      memoryOfAddedUsers[huntbotUser.id] = {}
    }
    if (_.has(memoryOfAddedUsers[huntbotUser.id], 'hb')) {
      if (memoryOfAddedUsers[huntbotUser.id].hb) return
    }
    memoryOfAddedUsers[huntbotUser.id].hb = true

    if (!memoryOfAddedUsers[huntbotUser.id].hb) return

    setTimeout(async () => {
      // Delete the huntbot document in DB
      bot.database.HuntBot.findOne({ userID: huntbotUser.id }, async (err, userHuntbot) => {
        if (err) bot.log('error', err)

        if (huntbotUser.id === userHuntbot.userID) {
          bot.database.HuntBot.deleteOne({ userID: huntbotUser.id })
          await bot.database.Userdata.findOneAndUpdate({ userID: huntbotUser.id }, { $set: { 'stats.completedHuntbots': userdata.stats.completedHuntbots + 1 } })
        }
      })

      let displayTime
      if (timeString) {
        displayTime = `\n${bot.emojis.blank} **|** Took \`${timeString}\` to finish`
      } else {
        displayTime = ''
      }

      // Send them the remind message
      try {
        await bot.getDMChannel(huntbotUser.id).then(async dmChannel => {
          await dmChannel.createMessage(`${bot.emojis.info} **|** Your HuntBot is complete!${displayTime}`)
        })
      } catch (e) {
        if (!channelID) return
        await bot.createMessage(channelID, `${bot.emojis.info} **|** <@${huntbotUser.id}> (Your DM's are turned off so i ping you here)\n${bot.emojis.blank} **|** your HuntBot is complete!${displayTime}`)
      }
      memoryOfAddedUsers[huntbotUser.id].hb = false
    }, timeoutTime)
  })
}
