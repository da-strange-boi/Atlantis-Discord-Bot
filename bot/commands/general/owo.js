exports.run = async (bot) => {
  bot.registerCommand('owo', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const userdata = await bot.getUserdata(message.author.id)

    if (userdata) {
      if (userdata.owo) {
        bot.updateUserdata('owo', false, message.author.id, userdata)
      } else {
        bot.updateUserdata('owo', true, message.author.id, userdata)
      }
      const owoEmbed = {
        embed: {
          color: userdata.owo ? bot.color.green : bot.color.red,
          description: userdata.owo ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo\`!`,
          timestamp: new Date()
        }
      }

      bot.createMessage(message.channel.id, owoEmbed)
    }
  }, {
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
