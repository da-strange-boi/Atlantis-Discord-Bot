// Hey maxi im watching you 👀
const fs = require("fs")
exports.run = (bot) => {
  let path = require("path").join(__dirname, "../")
  let pathBotAdmin = require("path").join(__dirname, "../botAdmin/")

  fs.readdirSync(path).forEach(file => {
    if(!fs.lstatSync(path + file).isDirectory()) {
      let command = require(`../${file}`)
      bot.log("system", `Command loaded: ${file}`)
      command.run(bot)
    }
  })

  fs.readdirSync(pathBotAdmin).forEach(file => {
    if(!fs.lstatSync(pathBotAdmin + file).isDirectory()) {
      let command = require(`${pathBotAdmin}/${file}`)
      bot.log("system", `Command loaded: ${file}`)
      command.run(bot)
    }
  })
}