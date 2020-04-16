exports.run = async (bot) => {
  bot.registerCommand("embed", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {
      let embedObject = ""
      args.forEach(arg => {
        embedObject += arg
      })
      bot.createMessage(message.channel.id, JSON.parse(embedObject))
    }
  })
}