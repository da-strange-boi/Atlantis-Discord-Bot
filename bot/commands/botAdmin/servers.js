exports.run = async (bot) => {
  bot.registerCommand("servers", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {

      const serversEmbed = {
        embed: {
          title: `All Servers - ${bot.guilds.size}`,
          color: bot.getEmbedColor(bot, message),
          description: "",
          timestamp: new Date()
        }
      }

      bot.guilds.forEach(guild => {
        serversEmbed.embed.description += `\`${guild.name}\` | Members: \`${guild.members.filter(member => !member.bot).length}\`\n`
      })

      bot.createMessage(message.channel.id, serversEmbed)
    }
  })
}