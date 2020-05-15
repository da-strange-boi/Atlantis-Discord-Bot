const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")

const util = require('util')

exports.run = async (bot) => {

  const app = express()

  app.set('views', path.join(__dirname, '/views'))
  app.use(express.static(__dirname + "/public"))

  app.engine("handlebars", exphbs({
    defaultLayout: "main"
  }))
  app.set("view engine", "handlebars")

  // Index Page
  app.get("/", async (req, res) => {
    res.render("index", {
      title: "Atlantis",
      cssFileName: "index"
    })
  })

  // Admin View Members Page
  app.get("/members", async (req, res) => {
    res.render("members", {
      title: "Atlantis Members",
      cssFileName: "members",
      members: await bot.database.Website.find({}).toArray(),
      helpers: {
        getPfp: function(obj) {return `https://cdn.discordapp.com/avatars/${obj.userID}/${obj.avatar.startsWith("a_") ? `${obj.avatar}.gif` : `${obj.avatar}.png`}`},
        getLevel: function(obj) {return obj.level == 3 ? "Atlantis Admin/Mod" : obj.level == 1 ? "Atlantis Recruit" : "Atlantis Member"},
        getLevelColor: function(obj) {return obj.level == 3 ? "level blue" : "level gold"},
        getBoost: function(obj) {return obj.premium != null ? `/images/server_boost.png` : `/images/blank.png`},
        hitreqText: function(obj) {return obj.owosPastWeek >= 50 ? `✔️ Hit owo requirement` : `❌ Did not hit owo requirement`},
        hitreqColor: function(obj) {return obj.owosPastWeek >= 50 ? "green" : "red"},
        getOwoCount: function(obj) {return `${obj.owosPastWeek} owos`}
      }
    })
  })

  // Look at a person
  app.get("/member/:userID", async (req, res) => {
    res.render("member", {
      title: "Member View",
      cssFileName: "memberView",
      member: await bot.database.Website.find({ userID: req.params.userID }).toArray(),
      helpers: {
        getPfp: function(obj) {obj = obj[0];return `https://cdn.discordapp.com/avatars/${obj.userID}/${obj.avatar.startsWith("a_") ? `${obj.avatar}.gif` : `${obj.avatar}.png`}`},
        getLevel: function(obj) {obj = obj[0];return obj.level == 3 ? "Atlantis Admin/Mod" : obj.level == 1 ? "Atlantis Recruit" : "Atlantis Member"},
        getLevelColor: function(obj) {obj = obj[0];return obj.level == 3 ? "level blue" : "level gold"},
        getBoost: function(obj) {obj = obj[0];return obj.premium != null ? `/images/server_boost.png` : `/images/blank.png`},
        hitreqText: function(obj) {obj = obj[0];return obj.owosPastWeek >= 50 ? "✔️ Hit owo requirement" : "❌ Did not hit owo requirement"},
        hitreqColor: function(obj) {obj = obj[0];return obj.owosPastWeek >= 50 ? "green" : "red"}
      }
    })
  })

  app.listen(80)

}