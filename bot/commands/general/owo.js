exports.run = async (bot) => {
  bot.registerCommand('owo', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log('error', err)

      if (userdata) {
        // if user does exist
        if (userdata.owo) {
          userdata.owo = false
          await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { owo: false } })
        } else {
          userdata.owo = true
          await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { owo: true } })
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
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
