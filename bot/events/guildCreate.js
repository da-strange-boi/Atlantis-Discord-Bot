exports.run = async (bot, guild) => {
  guild.members.forEach(member => {
    if (!member.user.bot) {
      bot.database.Userdata.findOne({ userID: member.id }, async (err, userdata) => {
        if (err) bot.log("error", err)
        if (!userdata) {
          await bot.database.Userdata.insertOne({
            userID: member.id,
            hunt: true,
            battle: false,
            owo: false,
            praycurse: true,
            huntbot: true,
            stats: {
              owoCount: 0,
              huntCount: 0,
              battleCount: 0,
              praycurseCount: 0,
              completedHuntbots: 0,
              totalHuntbotTime: 0,
              dailyOwoCount: 0,
              dailyHuntCount: 0,
              dailyBattleCount: 0,
              dailyPraycurseCount: 0,
            }
          })
        }
      })
    }
  })
  bot.database.Guilddata.findOne({ guildID: guild.id }, async (err, guilddata) => {
    if (err) bot.log("error", err)
    if (!guilddata) {
      await bot.database.Guilddata.insertOne({
        guildID: guild.id,
        prefix: "",
        deleteUserMessagesChannels: [],
        deleteBotMessagesChannels: [],
        owoChannel: [],
        welcomeChannel: [" ", "Welcome {user} to **{server}**!"],
        delete: []
      })
    }
  })

  // Logging
  let owner = await bot.getRESTUser(guild.ownerID)
  const loggingEmbed = {
    embed: {
      title: `:inbox_tray: Added Guild ${guild.large ? "- Large" : ""}`,
      color: 0xd4af37,
      thumbnail: {
        url: guild.iconURL ? guild.iconURL : `https://cdn.discordapp.com/embed/avatars/${(Math.floor(Math.random() * 9999)+1) % 5}.png`
      },
      description: `**• Guild:** \`${guild.name}\`\n**• Users:** \`${bot.users.filter(user => !user.bot).length}\`\n**• Bots:** \`${bot.users.filter(user => user.bot).length}\`\n**• Owner:** \`${owner.username}#${owner.discriminator}\` (<@${guild.ownerID}>)\n**• Region:** \`${guild.region}\``,
      footer: {
        text: `${bot.guilds.size} guilds`,
        icon_url: await owner.avatarURL
      },
      timestamp: new Date()
    }
  }
  bot.createMessage("699837667084599406", loggingEmbed)
}