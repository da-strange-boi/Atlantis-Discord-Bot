exports.run = async (bot) => {
  bot.registerCommand('battle', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const userdata = await bot.getUserdata(message.author.id)

    if (userdata) {
      if (userdata.battle) {
        bot.updateUserdata('battle', false, message.author.id, userdata)
      } else {
        bot.updateUserdata('battle', true, message.author.id, userdata)
      }
      const battleEmbed = {
        embed: {
          color: userdata.battle ? bot.color.green : bot.color.red,
          description: userdata.battle ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo battle\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo battle\`!`,
          timestamp: new Date()
        }
      }

      bot.createMessage(message.channel.id, battleEmbed)
    }
  }, {
    aliases: ['b', 'fight'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
