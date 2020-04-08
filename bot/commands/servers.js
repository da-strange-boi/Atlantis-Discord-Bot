exports.run = async (bot) => {
  bot.registerCommand("servers", async (message, args) => {
    for (let i = 0; i < bot.admins.length; i++) {
      if (message.author.id == bot.admins[i]) {

        const serversEmbed = {
          embed: {
            title: "All Servers",
            color: bot.getEmbedColor(bot, message),
            description: "",
            timestamp: new Date()
          }
        }

        bot.guilds.forEach(guild => {
          console.log('e')
          serversEmbed.embed.description += `\`${guild.name}\` | Members: \`${guild.members.filter(member => !member.bot).length}\`\n`
        })

        bot.createMessage(message.channel.id, serversEmbed)
      }
    }
  })
}