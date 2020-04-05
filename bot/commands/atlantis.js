/** @typedef {Eris.Client & getEmbedColor} bot */
exports.run = async (bot) => {
  bot.registerCommand("atlantis", async (message, args) => {
    await bot.checkUserAndGuild(message)

    bot.createMessage(message.channel.id, "https://discord.gg/FCUZeGb")
  }, {
    aliases: ["atl"],
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}