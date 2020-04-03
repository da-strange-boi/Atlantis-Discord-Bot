const fs = require("fs")

exports.run = (bot) => {
  let path = require("path").join(__dirname, "../")
  fs.readdirSync(path).forEach(file => {
    if(!fs.lstatSync(path + file).isDirectory()) {
      let command = require(`../${file}`)
      bot.log("system", `Command loadded: ${file}`)
      command.run(bot)
    }
  })
}