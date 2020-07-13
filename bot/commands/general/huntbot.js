exports.run = async (bot) => {
  bot.registerCommand('huntbot', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log('error', err)
      await bot.checkUserAndGuild(message)

      // if userdata doesn't exist make it
      if (userdata) {
        if (userdata.huntbot) {
          userdata.huntbot = false
          await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { huntbot: false } })
        } else {
          userdata.huntbot = true
          await bot.redis.hset('userdata', message.author.id, JSON.stringify(userdata))
          bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, { $set: { huntbot: true } })
        }
        const huntbotEmbed = {
          embed: {
            color: !userdata.huntbot ? bot.color.green : bot.color.red,
            description: !userdata.huntbot ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo huntbot\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo huntbot\`!`,
            timestamp: new Date()
          }
        }

        bot.createMessage(message.channel.id, huntbotEmbed)
      }
    })
  }, {
    aliases: ['hb'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
