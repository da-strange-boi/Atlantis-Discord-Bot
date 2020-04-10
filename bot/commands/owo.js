// Hey maxi im watching you 👀
exports.run = async (bot) => {
  bot.registerCommand("owo", async (message, args) => {
    await bot.checkUserAndGuild(message)
    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)
  
      if (userdata) {
        // if user does exist
        if (userdata.owo) {
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"owo":false}})
        } else {
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"owo":true}})
        }
        const owoEmbed = {
          embed: {
            color: !userdata.owo ? bot.color.green : bot.color.red,
            description: !userdata.owo ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo\`!`,
            timestamp: new Date()
          }
        }
  
        bot.createMessage(message.channel.id, owoEmbed)
      }
    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}