exports.run = async (bot) => {
  bot.registerCommand("hunt", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return
  
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)
  
      if (userdata) {
        if (userdata.hunt) {
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"hunt":false}})
        } else {
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"hunt":true}})
        }
        const huntEmbed = {
          embed: {
            color: !userdata.hunt ? bot.color.green : bot.color.red,
            description: !userdata.hunt ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo hunt\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo hunt\`!`,
            timestamp: new Date()
          }
        }
  
        bot.createMessage(message.channel.id, huntEmbed)
      }
    })
  }, {
    aliases: ["h", "catch"],
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}