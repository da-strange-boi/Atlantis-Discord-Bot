const fs = require("fs")
exports.run = (bot) => {
  const pathBotAdmin = require("path").join(__dirname, "botAdmin/")
  const pathGeneral  = require("path").join(__dirname, "general/")
  const pathAdmin  = require("path").join(__dirname, "admin/")
  const pathUtil  = require("path").join(__dirname, "util/")

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
  fs.readdirSync(pathAdmin).forEach(file => {
    if(!fs.lstatSync(pathAdmin + file).isDirectory()) {
      let command = require(`${pathAdmin}/${file}`)
      bot.log("system", `Command loaded: ${file}`)
      command.run(bot)
    }
  })
  fs.readdirSync(pathUtil).forEach(file => {
    if(!fs.lstatSync(pathUtil + file).isDirectory()) {
      let command = require(`${pathUtil}/${file}`)
      bot.log("system", `Command loaded: ${file}`)
      command.run(bot)
    }
  })
}