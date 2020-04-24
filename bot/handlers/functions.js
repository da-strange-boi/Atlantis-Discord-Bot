const Eris = require("eris")
const { CronJob } = require('cron')
const _ = require("lodash")
module.exports = async (bot) => {
  /** @typedef {function} bot.checkPermission
   * Checks the permission of the user within the bot
   * @param {Eris.message} message Eris message class
   * @param {String} typeOfPermission "botAdmin" | "botOwner"
   * @returns {Boolean} If true it has that permission
   */
  bot.checkPermission = async (message, typeOfPermission) => {
    let hasPermission
    switch (typeOfPermission) {
      case "botAdmin": bot.admins.includes(message.author.id) ? hasPermission = true : hasPermission = false; break
      case "botOwner": message.author.id == "295255543596187650" ? hasPermission = true : hasPermission = false; break
      default: return new TypeError("Invalid 'typeOfPermission' type")
    }
    return hasPermission
  }

  /** @typedef {function} bot.checkAndUpdateCategories
   * Update any deleted channels for admin commands
   * @param {Eris.message} msg Eris message class
   * @param {String} category The category type for the admin command
   * @param {String} channelID The channel id
   * @param {MongoDB.Collection} guilddata The guilddata document
   */
  bot.checkAndUpdateCategories = (msg, category, channelID, guilddata) => {
    let updatedList = guilddata[category]
    _.remove(updatedList, function(n) {
      return n == channelID
    })
    return bot.database.Guilddata.findOneAndUpdate({ guildID: msg.member.guild.id }, {$set: {[category]:updatedList}})
  }

  /** @typedef {function} bot.checkUserAndGuild
   * To update any user/guild objects that are out-dated or create new
   * @param {Eris.message} message Eris message class
   */
  bot.checkUserAndGuild = async (message) => {
    if (message.author.bot) return
    await bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)
      if (!userdata) {
        await bot.database.Userdata.insertOne({
          userID: message.author.id,
          hunt: true,
          battle: false,
          drop: false,
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
          },
          customs: [
            {
              id: 1,
              unlocked: true,
              name: "Untitled",
              trigger: "",
              triggerText: "",
              time: ""
            },
            {
              id: 2,
              unlocked: false,
              name: "Untitled",
              trigger: "",
              triggerText: "",
              time: ""
            },
            {
              id: 3,
              unlocked: false,
              name: "Untitled",
              trigger: "",
              triggerText: "",
              time: ""
            },
          ]
        })
      }
    })
    await bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
      if (err) bot.log("error", err)
      if (!guilddata) {
        await bot.database.Guilddata.insertOne({
          guildID: message.member.guild.id,
          prefix: "",
          deleteUserMessagesChannels: [],
          deleteBotMessagesChannels: [],
          owoChannel: [],
          welcomeChannel: [" ", "Welcome {user} to **{server}**!"],
          delete: []
        })
      }
    })
  }

  /** @typedef {function} getEmbedColor
   * Gets the embed color depending on the bots roles
   * @param {Eris.CommandClient} bot The Eris Client
   * @param {Eris.message} message The Eris Message Class
   * @returns {number} base 10 of color
  */
  bot.getEmbedColor = (bot, message) => {
    const comparePositions = (role1, role2) => {
      if (role1.position === role2.position) return role2.id - role1.id;
      return role1.position - role2.position;
    }

    const memberRoleObjects = []
    message.member.guild.roles.forEach(guildRole => {
      message.member.guild.members.get(bot.user.id).roles.forEach(memberRole => {
        if (guildRole.id == memberRole) {
          memberRoleObjects.push(guildRole)
        }
      })
    })

    const coloredRoles = memberRoleObjects.filter(role => role.color)
    if (coloredRoles.length == 0) return 0xd4af37
    const color = coloredRoles.reduce((prev, role) => (!prev || comparePositions(role, prev) > 0 ? role : prev));
    return color.color
  }

  /** @typedef {function} checkBannedUsers
   * Checks to see if the given user id is bot banned
   * @param {String} id The user id
   * @returns {Boolean} If the user is bot banned or not
   */
  bot.checkBannedUsers = (id) => {
    if (bot.botBannedUsers.includes(id)) {
      return true
    } else {
      return false
    }
  }

  // Delete daily stats
  let resetDailyStats = new CronJob("0 0 3 * * *", async () => {
    await bot.database.Userdata.find({}).toArray((err, users) => {
      if (err) bot.log("error", err)
      users.forEach(user => {
        bot.database.Userdata.findOneAndUpdate({ userID: user.userID }, {$set: {"stats.dailyOwoCount":0}})
        bot.database.Userdata.findOneAndUpdate({ userID: user.userID }, {$set: {"stats.dailyHuntCount":0}})
        bot.database.Userdata.findOneAndUpdate({ userID: user.userID }, {$set: {"stats.dailyBattleCount":0}})
        bot.database.Userdata.findOneAndUpdate({ userID: user.userID }, {$set: {"stats.dailyPraycurseCount":0}})
      })
    })
  }, null, true, "America/New_York")
  resetDailyStats.start()
}