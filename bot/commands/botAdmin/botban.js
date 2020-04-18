exports.run = async (bot) => {
  bot.registerCommand("botban", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {

      // bot.database.BotBan.findOne({}, async (err, bannedUser) => {
      bot.database.BotBan.find({}).toArray(async(err, users) => {
        if (err) bot.log("error", err)

        if (!args[0]) {
          const botbannedEmbed = {
            embed: {
              title: "Bot Banned Users",
              color: bot.getEmbedColor(bot, message),
              fields: [

              ],
              timestamp: new Date()
            }
          }
          await users.forEach(async user => {
            botbannedEmbed.embed.fields.push({name: `${await user.name} <@${user.userID}>`,value: `${user.reason}`})
          })
          await bot.createMessage(message.channel.id, botbannedEmbed)
        } else {

          const userID = args.shift()
          const reason = args.join(" ")
          const userObj = await bot.getRESTUser(userID)

          await bot.database.BotBan.insertOne({
            userID: userID,
            name: `${userObj.username}#${userObj.discriminator}`,
            reason: reason
          })

          const botbannedEmbed = {
            embed: {
              author: {
                name: `${userObj.username}#${userObj.discriminator} had been bot banned!`,
                icon_url: `${userObj.avatarURL}`
              },
              color: bot.color.red,
              description: `<@${userID}>\nReason: \`${reason}\``,
              timestamp: new Date()
            }
          }
          bot.botBannedUsers.push(userID)
          await bot.createMessage(message.channel.id, botbannedEmbed)
        }
      })
    }
  })
}