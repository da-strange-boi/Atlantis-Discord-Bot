// Hey maxi im watching you 👀
exports.run = async (bot) => {
  bot.registerCommand("atlantis", async (message, args) => {
    await bot.checkUserAndGuild(message)

    bot.createMessage(message.channel.id, "A DM has been sent with the invite link to Atlantis :trident:")
    bot.getDMChannel(message.author.id).then(channel => {
      channel.createMessage("https://discord.gg/FCUZeGb")
    })
  }, {
    aliases: ["atl"],
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}