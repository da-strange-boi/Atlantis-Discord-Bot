exports.run = async (bot) => {
  bot.registerCommand("invite", async (message, args) => {
    await bot.checkUserAndGuild(message)

    const inviteEmbed = {
      embed: {
        color: bot.getEmbedColor(bot, message),
        description: "[Click here to add Atlantis to your server!](https://discordapp.com/oauth2/authorize?client_id=688911718788628496&permissions=321600&scope=bot)"
      }
    }
    bot.createMessage(message.channel.id, inviteEmbed)
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}