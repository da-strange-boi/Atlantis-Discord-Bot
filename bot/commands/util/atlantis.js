exports.run = async (bot) => {
  bot.registerCommand('atlantis', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const getAtlantisInvite = process.env.ATLANTIS_INVITE

    if (getAtlantisInvite !== 'null') {
      try {
        await bot.getDMChannel(message.author.id).then(async channel => {
          await channel.createMessage(getAtlantisInvite)
        })
        await bot.createMessage(message.channel.id, 'A DM has been sent with the invite link to Atlantis :trident:')
      } catch (e) {
        bot.createMessage(message.channel.id, `${bot.user.username} could not DM you\n${getAtlantisInvite}`)
      }
    } else {
      await bot.createMessage(message.channel.id, 'Sorry this command is currently disabled')
    }
  }, {
    aliases: ['atl'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
