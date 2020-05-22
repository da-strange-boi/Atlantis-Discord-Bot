exports.run = async (bot) => {
  bot.registerCommand("custom", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return
    if (!await bot.checkBotPermission(message, ["readMessages", "sendMessages"])) return

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      // Error maker
      const cmdError = async (_message) => {
        const errorEmbed = {
          embed: {
            title: "Error!",
            color: bot.color.red,
            description: _message,
            timestamp: new Date()
          }
        }
        await bot.createMessage(message.channel.id, errorEmbed)
      }

      // Main dashboard
      if (!args[0]) {
        const customEmbed = {
          embed: {
            title: "Custom Timers",
            color: bot.getEmbedColor(bot, message),
            description: "Custom timers allow you to have more control over what you need to do!\n[Vote](https://top.gg/bot/688911718788628496/vote) for Atlantis to unlock 2 & 3",
            fields: [],
            timestamp: new Date()
          }
        }

        let hasCustomSet = false
        let counter = 1
        userdata.customs.forEach(custom => {
          if (custom.triggerText != "") {
            if (!hasCustomSet) hasCustomSet = true
            customEmbed.embed.fields.push({name:`**${counter}**: \`${custom.triggerText}${!custom.unlocked ? " (Locked)" : ""}\``, value:`Trigger Check: \`${custom.trigger}\`\nTime: \`${custom.displayTime}\``})
          } else {
            customEmbed.embed.fields.push({name:`**${counter}**: \`Not Set${!custom.unlocked ? " (Locked)" : ""}\``, value:"---"})
          }
          counter++
        })

        if (!hasCustomSet) {
          customEmbed.embed.fields.push({name:"No custom timers set", value: "Set one by doing `a!custom set <b/a/e> <time> <trigger word/phrase>`\nSee `a!help custom` for more help"})
        }

        await bot.createMessage(message.channel.id, customEmbed)
      } else {

        // to set/delete a custom
        let option = args[0] // set||delete
        let trigger = args[1] // b||a||e
        let time = args[2] // 1M30S
        const triggerText = message.content.split(args[2] + " ")[1] // not reliable but should work for now

        // A bunch of checks lol
        if (option) {

          if (option) option = option.toLowerCase()
          if (trigger) trigger = trigger.toLowerCase()
          if (time) time = time.toUpperCase()

          if (option == "set") {

            if (!option || !trigger || !time || !triggerText) return cmdError("Didn't provide enough information for setting a timer\ncheck `a!help custom` for more help")

            if ((trigger == "b") || (trigger == "a") || (trigger == "e")) {
              const setTime = time.match(/[0-9][0-9][M|S]{1}|[0-9][M|S]{1}/g)
              let userSetTime = 0
              if (setTime) {

                setTime.forEach(time => {
                  if (time[1] == "S") {
                    userSetTime += parseInt(time[0]) * 1000
                  } else if (time[2] == "S") {
                    userSetTime += parseInt(time[0] + time[1]) * 1000
                  }
                  if (time[1] == "M") {
                    userSetTime += parseInt(time[0]) * 60000
                  } else if (time[2] == "M") {
                    userSetTime += parseInt(time[0] + time[1]) * 60000
                  }
                })

                if (userSetTime != 0) {

                  // This is a mess
                  let modifyCustom = userdata.customs
                  let didUpdateCustoms = false
                  for (let i = 0; i < userdata.customs.length; i++) {
                    if (userdata.customs[i].id == 1 && userdata.customs[i].triggerText == "") {
                      if (!didUpdateCustoms) didUpdateCustoms = true

                      modifyCustom[i].trigger = trigger
                      modifyCustom[i].triggerText = triggerText
                      modifyCustom[i].time = userSetTime
                      modifyCustom[i].displayTime = time

                      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"customs":modifyCustom}})
                      await bot.createMessage(message.channel.id, {embed:{title:"Success!",color:bot.color.green,description:"Custom timer has been added",timestamp:new Date()}})
                      break
                    } else if (userdata.customs[i].id == 2 && userdata.customs[i].triggerText == "" && userdata.customs[i].unlocked) {
                      if (!didUpdateCustoms) didUpdateCustoms = true

                      modifyCustom[i].trigger = trigger
                      modifyCustom[i].triggerText = triggerText
                      modifyCustom[i].time = userSetTime
                      modifyCustom[i].displayTime = time

                      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"customs":modifyCustom}})
                      await bot.createMessage(message.channel.id, {embed:{title:"Success!",color:bot.color.green,description:"Custom timer has been added",timestamp:new Date()}})
                      break
                    } else if (userdata.customs[i].id == 3 && userdata.customs[i].triggerText == "" && userdata.customs[i].unlocked) {
                      if (!didUpdateCustoms) didUpdateCustoms = true

                      modifyCustom[i].trigger = trigger
                      modifyCustom[i].triggerText = triggerText
                      modifyCustom[i].time = userSetTime
                      modifyCustom[i].displayTime = time

                      await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"customs":modifyCustom}})
                      await bot.createMessage(message.channel.id, {embed:{title:"Success!",color:bot.color.green,description:"Custom timer has been added",timestamp:new Date()}})
                      break
                    }
                  }

                  if (!didUpdateCustoms) {
                    return cmdError("You most likely don't have another slot open or unlocked")
                  }

                } else {
                  return cmdError("Time is probably out of range\ncheck `a!help custom` for more help")
                }
              } else {
                return cmdError("Incorrect time format\ncheck `a!help custom` for more help")
              }
            } else {
              return cmdError("Incorrect trigger check\ncheck `a!help custom` for more help")
            }
          } else if (option == "delete") {

            // a!custom delete 1
            let number = parseInt(args[1])-1
            if (number > -1 && number < 3) {

              let modifyCustom = userdata.customs
              modifyCustom[number].trigger = ""
              modifyCustom[number].triggerText = ""
              modifyCustom[number].time = 0
              modifyCustom[number].displayTime = ""

              await bot.database.Userdata.findOneAndUpdate({ userID: message.author.id }, {$set: {"customs":modifyCustom}})
              await bot.createMessage(message.channel.id, {embed:{title:"Success!",color:bot.color.green,description:"Custom timer has been deleted",timestamp:new Date()}})

            } else {
              return cmdError("Number out of range 1-3\ncheck `a!help custom` for more help")
            }

          } else {
            return cmdError("Incorrect option provided\ncheck `a!help custom` for more help")
          }
        } else {
          return cmdError("Incorrect syntax provided\ncheck `a!help custom` for more help")
        }
      }
    })
  }, {
    cooldown: 3000,
    cooldownMessage: "Whoa there slow down, the cooldown is 3 seconds!"
  })
}