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
            praycurse: true,
            huntbot: true
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
        welcomeChannel: [" ", "Welcome {user} to **{server}**!"]
      })
    }
  })
}