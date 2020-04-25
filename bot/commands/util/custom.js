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
            customEmbed.embed.fields.push({name:`**${counter}**: \`${custom.triggerText}${!custom.unlocked ? " (Locked)" : ""}\``, value:`Trigger Code: \`${custom.trigger}\`\nTime: \`${custom.displayTime}\``})
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

            if (!option || !trigger || !time || !triggerText) console.log("wrong syntax") // error

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
                    bot.createMessage(message.channel.id, {embed:{title:"Error!",color:bot.color.red,description:"You most likely don't have another slot open or unlocked",timestamp: new Date()}})
                  }

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
              // error: out of range
              console.log("ofr")
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