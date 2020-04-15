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
            fields: [
              {
                name: ":peacock: **Hunt**",
                value: userdata.hunt ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: ":tropical_fish: **Battle**",
                value: userdata.battle ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: ":dragon: **Pray/Curse**",
                value: userdata.praycurse ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: ":deer: **HuntBot**",
                value: userdata.huntbot ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: ":unicorn: **OwO**",
                value: userdata.owo ? "Enabled" : "Disabled",
                inline: true
              }
            ],
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