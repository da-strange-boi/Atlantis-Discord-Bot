exports.run = async (bot, guild) => {
  guild.members.forEach(member => {
    if (!member.user.bot) {
      bot.database.Userdata.findOne({ userID: member.id }, async (err, userdata) => {
        if (err) bot.log("error", err)
        if (!userdata) {
          await bot.database.Userdata.insertOne({
            userID: member.id,
            hunt: true,
            battle: false,
            owo: false,
            praycurse: true,
            huntbot: true,
            stats: {
              owoCount: 0,
              huntCount: 0,
              battleCount: 0,
              praycurseCount: 0,
              completedHuntbots: 0,
              totalHuntbotTime: 0,
              dailyOwoCount: 0,
              dailyHuntCount: 0,
              dailyBattleCount: 0,
              dailyPraycurseCount: 0,
            }
          })
        }
      })
    }
  })
  bot.database.Guilddata.findOne({ guildID: guild.id }, async (err, guilddata) => {
    if (err) bot.log("error", err)
    if (!guilddata) {
      await bot.database.Guilddata.insertOne({
        guildID: guild.id,
        deleteUserMessagesChannels: [],
        deleteBotMessagesChannels: [],
        owoChannel: [],
        welcomeChannel: [" ", "Welcome {user} to **{server}**!"],
        delete: []
      })
    }
  })
}