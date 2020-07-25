exports.run = async (bot) => {
  bot.registerCommand('praycurse', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const userdata = await bot.getUserdata(message.author.id)

    if (userdata) {
      if (userdata.praycurse) {
        bot.updateUserdata('praycurse', false, message.author.id, userdata)
      } else {
        bot.updateUserdata('praycurse', true, message.author.id, userdata)
      }
      const praycurseEmbed = {
        embed: {
          color: userdata.praycurse ? bot.color.green : bot.color.red,
          description: userdata.praycurse ? `<@${message.author.id}>, You have **enabled** the reminder for \`owo pray\` & \`owo curse\`!` : `<@${message.author.id}>, You have **disabled** the reminder for \`owo pray\` & \`owo curse\`!`,
          timestamp: new Date()
        }
      }

      bot.createMessage(message.channel.id, praycurseEmbed)
    }
  }, {
    aliases: ['pray', 'curse'],
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
