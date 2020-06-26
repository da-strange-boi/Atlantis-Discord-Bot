exports.run = async (bot) => {
  bot.registerCommand('praycurse', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log('error', err)

      // if userdata doesn't exist make it
      if (userdata) {
        // if user does exist
        if (userdata.praycurse) {
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { praycurse: false } })
        } else {
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { praycurse: true } })
        }
        const praycurseEmbed = {
          embed: {
            color: !userdata.praycurse ? bot.color.green : bot.color.red,
            description: !userdata.praycurse ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo pray\` & \`owo curse\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo pray\` & \`owo curse\`!`,
            timestamp: new Date()
          }
        }

        bot.createMessage(message.channel.id, praycurseEmbed)
      }
    })
  }, {
    aliases: ['pray', 'curse'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
