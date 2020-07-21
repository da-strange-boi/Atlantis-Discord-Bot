exports.run = async (bot) => {
  bot.registerCommand('hunt', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const userdata = await bot.getUserdata(message.author.id)

    if (userdata) {
      if (userdata.hunt) {
        bot.updateUserdata('hunt', false, message.author.id, userdata)
      } else {
        bot.updateUserdata('hunt', true, message.author.id, userdata)
      }
      const huntEmbed = {
        embed: {
          color: userdata.hunt ? bot.color.green : bot.color.red,
          description: userdata.hunt ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo hunt\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo hunt\`!`,
          timestamp: new Date()
        }
      }

      bot.createMessage(message.channel.id, huntEmbed)
    }
  }, {
    aliases: ['h', 'catch'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
