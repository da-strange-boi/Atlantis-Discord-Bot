exports.run = async (bot) => {
  bot.registerCommand('battle', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log('error', err)

      if (userdata) {
        // if user does exist
        if (userdata.battle) {
          userdata.battle = false
          await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { battle: false } })
        } else {
          userdata.battle = true
          await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { battle: true } })
        }
        const battleEmbed = {
          embed: {
            color: !userdata.battle ? bot.color.green : bot.color.red,
            description: !userdata.battle ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo battle\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo battle\`!`,
            timestamp: new Date()
          }
        }

        bot.createMessage(message.channel.id, battleEmbed)
      }
    })
  }, {
    aliases: ['b', 'fight'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
