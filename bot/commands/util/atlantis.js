exports.run = async (bot) => {
  bot.registerCommand("atlantis", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return
    if (!await bot.checkBotPermission(message, ["readMessages", "sendMessages"])) return
    

    try {
      await bot.getDMChannel(message.author.id).then(async channel => {
        await channel.createMessage("https://discord.gg/FCUZeGb")
      })
      await bot.createMessage(message.channel.id, "A DM has been sent with the invite link to Atlantis :trident:")
    } catch (e) {
      bot.createMessage(message.channel.id, `${bot.user.username} could not DM you\nhttps://discord.gg/FCUZeGb`)
    }
  }, {
    aliases: ["atl"],
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}