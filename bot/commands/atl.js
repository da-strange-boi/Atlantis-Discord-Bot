/** @typedef {Eris.Client & getEmbedColor} bot */
exports.run = async (bot) => {
  bot.registerCommand("atl", async (message, args) => {
    await bot.checkUserAndGuild(message)

    bot.createMessage(message.channel.id, "https://discord.gg/Rp9Gzmh")
  }, {
    aliases: ["atlantis"],
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}