exports.run = async (bot, guild) => {
  await bot.database.Guilddata.deleteOne({ userID: guild.id })
}
