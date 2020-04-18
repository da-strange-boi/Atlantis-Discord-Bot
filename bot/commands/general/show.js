exports.run = async (bot) => {
  bot.registerCommand("show", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return
    
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)
      await bot.checkUserAndGuild(message)
      
      if (userdata) {
        const showEmbed = {
          embed: {
            color: bot.getEmbedColor(bot, message),
            author: {
              name: `${message.author.username}#${message.author.discriminator}`,
              icon_url: message.author.avatarURL
            },
            fields: [
              {
                name: `${bot.emojis.native.hunt} **Hunt**`,
                value: userdata.hunt ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: `${bot.emojis.native.battle} **Battle**`,
                value: userdata.battle ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: `${bot.emojis.pray} **Pray/Curse**`,
                value: userdata.praycurse ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: `${bot.emojis.native.huntbot} **HuntBot**`,
                value: userdata.huntbot ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: `${bot.emojis.owo} **OwO**`,
                value: userdata.owo ? "Enabled" : "Disabled",
                inline: true
              },
              {
                name: `${bot.emojis.native.drop} **Drop**`,
                value: userdata.drop ? "Enabled" : "Disabled",
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