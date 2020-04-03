exports.run = async (bot) => {
  bot.registerCommand("show", async (message, args) => {
    await bot.checkUserAndGuild(message)
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)
      await bot.checkUserAndGuild(message)
      
      if (userdata) {
        const showEmbed = {
          embed: {
            color: bot.getEmbedColor(bot, message),
            description: `**Hunt** ~ ${userdata.hunt ? "Enabled" : "Disabled"}\n**Battle** ~ ${userdata.battle ? "Enabled" : "Disabled"}\n**Pray/Curse** ~ ${userdata.praycurse ? "Enabled" : "Disabled"}\n**HuntBot** ~ ${userdata.huntbot ? "Enabled" : "Disabled"}`,
            timestamp: new Date()
          }
        }
  
        bot.createMessage(message.channel.id, showEmbed)
      }
    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}