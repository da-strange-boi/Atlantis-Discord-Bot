const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const ms = require("parse-ms")

const _ = require("lodash")

const formatNumber = (number) => {
  return Intl.NumberFormat().format(number)
}

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
      cssFileName: "index",
      member: await bot,
      staff: await bot.database.Website.find({ level: 3 }).toArray(),
      helpers: {
        getPfp: function(obj) {return `https://cdn.discordapp.com/avatars/${obj.userID}/${obj.avatar.startsWith("a_") ? `${obj.avatar}.gif` : `${obj.avatar}.png`}`},
        getGuildCount: function(){ return formatNumber(bot.guilds.size) },
        getUsersCount: function(){ return formatNumber(bot.users.size) },
        getUptime: function(){ let time = ms(bot.uptime); return `${time.days} days, ${time.hours}h ${time.minutes}m ${time.seconds}s ${time.milliseconds}ms` }
      }
    })
  })

  // Admin View Members Page
  app.get("/members", async (req, res) => {
    let aotwMembers = await bot.database.Website.find({}).sort({ owosPastWeek: -1 }).limit(3).toArray()
    let aotwID = []
    for (let i = 0; i < aotwMembers.length; i++) { aotwID.push(aotwMembers[i].userID) }
    let members = await bot.database.Website.find({ userID: {$nin: aotwID } }).sort({ owosPastWeek: -1 }).toArray()

    res.render("members", {
      title: "Atlantis Members",
      cssFileName: "members",
      members: members,
      aotw: aotwMembers,
      helpers: {
        getPfp: function(obj) {return obj.avatar == null ? `https://cdn.discordapp.com/embed/avatars/${obj.userTag.split("#")[1] % 5}.png` : `https://cdn.discordapp.com/avatars/${obj.userID}/${obj.avatar.startsWith("a_") ? `${obj.avatar}.gif` : `${obj.avatar}.png`}`},
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
        getAtlantisJoin: function(obj) {obj = obj[0];return new Date(obj.joinedAtlantis).toUTCString()},
        hitreqText: function(obj) {obj = obj[0];return obj.owosPastWeek >= 50 ? "✔️ Hit owo requirement" : "❌ Did not hit owo requirement"},
        hitreqColor: function(obj) {obj[0] ? obj = obj[0] : obj=obj;return (obj.owosPastWeek || obj.amountOfOwos) >= 50 ? "green" : "red"},
        getHitReq: function(obj) {return obj == "⚠️" ? "⚠️ User has been excuse" : obj == "✔️" ? "✔️ Hit owo requirement" : "❌ Did not hit owo requirement"},
        getOwoCount: function(obj) {return `${obj} owos`},
        owoCountTime: function(obj) {let time = ms((obj * 10) * 1000);return `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`}
      }
    })
  })

  // Reset all owos
  app.get("/weekReset", async (req, res) => {
    const date = new Date()
    await bot.database.Website.find({}).forEach(async (member) => {
      let newArchive = {
        weekOf: `${date.getMonth()+1}/${date.getDate()-date.getDay()} - ${date.getMonth()+1}/${(date.getDate()-date.getDay())+6}`,
        amountOfOwos: member.owosPastWeek,
        hitreq: member.owosPastWeek >= 50 ? "✔️" : "❌",
        time: Date.now()
      }
      let userAchieves = member.owosArchive
      userAchieves.push(newArchive)
      await bot.database.Website.findOneAndUpdate({ userID: member.userID }, {$set: {"owosPastWeek":0}})
      await bot.database.Website.findOneAndUpdate({ userID: member.userID }, {$set: {"owosArchive":userAchieves}})
    })
    res.redirect("/members")
  })

  // Excuse an missed week of owo req
  app.get("/excuse/:id/:time", async (req, res) => {
    let id = req.params.id
    let time = req.params.time
    await bot.database.Website.findOne({ userID: id }, async (err, webUser) => {
      for (let i = 0; i < webUser.owosArchive.length; i++) {
        if (webUser.owosArchive[i].time == time) {
          await bot.database.Website.findOneAndUpdate({ userID: id }, {$set: {[`owosArchive.${i}.hitreq`]:"⚠️"}})
        }
      }
    })
    res.redirect(`/member/${id}`)
  })

  // Delete a user
  app.get("/delete/:id", async (req, res) => {
    let id = req.params.id
    await bot.database.Website.deleteOne({userID: id})
    res.redirect(`/members`)
  })

  app.listen(80, () => {
    bot.log("system", "Website connected")
  })

}