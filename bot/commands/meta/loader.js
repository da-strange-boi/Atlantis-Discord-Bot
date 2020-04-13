// Hey maxi im watching you 👀
const fs = require("fs")
exports.run = (bot) => {
  const path = require("path").join(__dirname, "../")
  const pathBotAdmin = require("path").join(__dirname, "../botAdmin/")
  const pathGeneral  = require("path").join(__dirname, "../general/")

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

  fs.readdirSync(pathGeneral).forEach(file => {
    if(!fs.lstatSync(pathGeneral + file).isDirectory()) {
      let command = require(`${pathGeneral}/${file}`)
      bot.log("system", `Command loaded: ${file}`)
      command.run(bot)
    }
  })
}