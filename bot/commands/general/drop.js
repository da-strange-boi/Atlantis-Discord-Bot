exports.run = async (bot) => {
  bot.registerCommand('drop', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const userdata = await bot.getUserdata(message.author.id)

    if (userdata) {
      if (userdata.drop) {
        bot.updateUserdata('drop', false, message.author.id, userdata)
      } else {
        bot.updateUserdata('drop', true, message.author.id, userdata)
      }
      const dropEmbed = {
        embed: {
          color: userdata.drop ? bot.color.green : bot.color.red,
          description: userdata.drop ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo drop\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo drop\`!`,
          timestamp: new Date()
        }
      }

      bot.createMessage(message.channel.id, dropEmbed)
    }
  }, {
    aliases: ['pickup'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
