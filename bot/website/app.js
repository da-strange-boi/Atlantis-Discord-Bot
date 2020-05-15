const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")

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
      cssFileName: "members"
    })
  })

  app.listen(80)

}