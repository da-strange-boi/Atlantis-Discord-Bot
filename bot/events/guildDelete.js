const _ = require("lodash")
exports.run = async (bot, guild) => {
  await bot.database.Guilddata.deleteOne({ userID: guild.id })

  // Logging
  let owner = await bot.getRESTUser(guild.ownerID)
  const loggingEmbed = {
    embed: {
      title: `:outbox_tray: Removed Guild ${guild.large ? "- Large" : ""}`,
      color: bot.color.red,
      thumbnail: {
        url: guild.iconURL ? guild.iconURL : `https://cdn.discordapp.com/embed/avatars/${(Math.floor(Math.random() * 9999)+1) % 5}.png`
      },
      description: `**• Guild:** \`${guild.name}\`\n**• Users:** \`${guild.members.filter(member => !member.bot).length}\`\n**• Bots:** \`${guild.members.filter(member => member.bot).length}\`\n**• Owner:** \`${owner.username}#${owner.discriminator}\` (<@${guild.ownerID}>)\n**• Region:** \`${guild.region}\``,
      footer: {
        text: `${bot.guilds.size} guilds`,
        icon_url: await owner.avatarURL
      },
      timestamp: new Date()
    }
  }
  bot.createMessage("700418791523352703", loggingEmbed)
  
}