exports.run = async (bot) => {
  bot.registerCommand('ping', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const ping = bot.shards.random().latency
    bot.createMessage(message.channel.id, `Pong! :alarm_clock: | Latency is ${ping}ms`)
  }, {
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
