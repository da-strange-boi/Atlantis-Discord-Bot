exports.run = async (bot, guild) => {
  bot.database.Guilddata.findOne({ guildID: guild.id }, async (err, guilddata) => {
    if (err) bot.log('error', err)

    if (!guilddata) {
      await bot.database.Guilddata.insertOne({
        guildID: guild.id,
        prefix: '',
        deleteUserMessagesChannels: [],
        deleteBotMessagesChannels: [],
        owoChannel: [],
        delete: []
      })
    }
  })

  // Logging
  const owner = await bot.getRESTUser(guild.ownerID)
  const loggingEmbed = {
    embed: {
      title: `:inbox_tray: Added Guild ${guild.large ? '- Large' : ''}`,
      color: 0xd4af37,
      thumbnail: {
        url: guild.iconURL ? guild.iconURL : `https://cdn.discordapp.com/embed/avatars/${(Math.floor(Math.random() * 9999) + 1) % 5}.png`
      },
      description: `**• Guild:** \`${guild.name}\`\n**• Users:** \`${guild.members.filter(member => !member.bot).length}\`\n**• Bots:** \`${guild.members.filter(member => member.bot).length}\`\n**• Owner:** \`${owner.username}#${owner.discriminator}\` (<@${guild.ownerID}>)\n**• Region:** \`${guild.region}\``,
      footer: {
        text: `${bot.guilds.size} guilds`,
        icon_url: await owner.avatarURL
      },
      timestamp: new Date()
    }
  }
  bot.createMessage('700418791523352703', loggingEmbed)
}
