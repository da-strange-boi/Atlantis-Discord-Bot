exports.run = async (bot) => {
  bot.registerCommand("custom", async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log("error", err)

      // Main dashboard
      if (!args[0]) {
        const customEmbed = {
          embed: {
            title: "Custom Timers",
            color: bot.getEmbedColor(bot, message),
            description: "Custom timers allow you to have more control over what you need to do!",
            fields: [],
            timestamp: new Date()
          }
        }

        let hasCustomSet = false
        userdata.customs.forEach(custom => {
          if (custom.triggerText != "") {
            if (!hasCustomSet) hasCustomSet = true
            customEmbed.embed.fields.push({name:`${custom.name} ${!custom.unlocked ? "(Locked)" : ""}`, value:`Code: ${custom.trigger}\nTrigger: ${custom.triggerText}\nTime: ${custom.time}`})
          }
        })

        if (!hasCustomSet) {
          customEmbed.embed.fields.push({name:"No custom timers set", value: "Set one by doing `a!custom set <b/a/e> <time> <trigger word/phrase>`\nSee `a!help custom` for more help"})
        }

        await bot.createMessage(message.channel.id, customEmbed)
      } else {

        // to set/delete a custom
        const option = args[0].toLowerCase() // set||delete
        const trigger = args[1].toLowerCase() // b||a||e
        const time = args[2].toUpperCase() // 1M30S
        const triggerText = message.content.split(args[2] + " ")[1] // not reliable but should work for now

        // A bunch of checks lol
        if (option && trigger && time && triggerText) {
          if ((option == "set") || (option == "delete")) {
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

                  userdata.customs.forEach(custom => {
                    if (custom.id == 1 && custom.triggerText == "") {
                      await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"customs":[]}})
                    } 
                  })

                } else {
                  // error: probably time out of range
                }
              } else {
                // error: incorrect time format
                console.log('tf')
              }
            } else {
              // error: incorrect trigger check
              console.log('tc')
            }
          } else {
            // error: incorrect option
            console.log('o')
          }
        } else {
          // error: incorrect syntax
          console.log('s')
        }
      }
    })
  })
}