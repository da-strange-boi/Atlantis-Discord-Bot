exports.run = async (bot, guild) => {
  bot.database.Guilddata.findOne({ guildID: guild.id }, async (err, guilddata) => {
    if (err) bot.log('error', err)

    if (!guilddata) {
      await bot.database.Guilddata.insertOne({
        guildID: guild.id,
        prefix: '',
        deleteUserMessagesChannels: [],
        deleteBotMessagesChannels: [],
        owoChannel: [],
        welcomeChannel: [' ', 'Welcome {user} to **{server}**!'],
        delete: []
      })
    }
  })
}
