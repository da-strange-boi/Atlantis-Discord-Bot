exports.run = async (bot) => {
  bot.registerCommand("vote", async (message, args) => {
    await bot.createMessage(message.channel.id, `${bot.emojis.blank} **|** You can vote for Atlantis here:\n${bot.emojis.blank} **|** https://top.gg/bot/688911718788628496/vote`)
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}