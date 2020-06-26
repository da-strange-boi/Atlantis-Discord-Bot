exports.run = async (bot) => {
  bot.registerCommand("embed", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {

      if (args[0] == "roles") {
        const roleEmbed = {
          embed: {
            title: "Notify Roles",
            color: 0xFEFEFE,
            description: ":exclamation: **-** Get notified on main bot updates\n:bangbang: **-** Get notified on server updates"
          }
        }
        return bot.createMessage(message.channel.id, roleEmbed)
      }
      if (args[0] == "colors") {
        const roleEmbed = {
          embed: {
            title: "Color Roles",
            color: 0xFEFEFE,
            description: "<:1_:700269035245535313> **-** :one:\n<:2:700269020019949579> **-** :two:\n<:3:700268998465683468> **-** :three:\n<:4:700268986440482877> **-** :four:\n<:5:700268975883419691> **-** :five:"
          }
        }
        return bot.createMessage(message.channel.id, roleEmbed)
      }
      if (args[0] == "info") {
        const infoEmbed = {
          embed: {
            title: "<:info:689965598997872673> Information",
            color: 0xFEFEFE,
            description: "This server is for the Atlantis bot. The Atlantis bot is a bot made for <@408785106942164992> to remind you about your cooldowns and more!",
            fields: [
              {
                name: "• Want to add atlantis to your server?",
                value: "[Click Here](https://discordapp.com/oauth2/authorize?client_id=688911718788628496&permissions=321600&scope=bot)"
              },
              {
                name: "• Have a bot suggestion?",
                value: "Do `?suggest <suggestion>` to submit one"
              },
              {
                name: "• Have a server suggestion?",
                value: "Contact: <@295255543596187650>"
              }
            ]
          }
        }
        return bot.createMessage(message.channel.id, infoEmbed)
      }

      let embedObject = ""
      args.forEach(arg => {
        embedObject += arg
      })
      bot.createMessage(message.channel.id, JSON.parse(embedObject))
    }
  })
}