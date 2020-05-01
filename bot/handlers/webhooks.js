const express = require("express")
const bodyParser = require("body-parser")
const fetch = require("node-fetch")
exports.run = async (bot) => {

  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))

  app.post("/donation", async (req, res) => {
    const channel = bot.guilds.find(guild => guild.id == "699419850556178534").channels.find(channel => channel.id == "700210893467680788")
    let webhook = await channel.getWebhooks()
    let url = `https://discordapp.com/api/webhooks/${webhook[0].id}/${webhook[0].token}`

    let body = {
      embeds: [
        {
          title: JSON.parse(req.body.data).from_name,
          color: 2730976,
          author: {
            name: "Thanks very much for the donation!"
          }
        }
      ]
    }

    fetch(url, {
      method: "post",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(body),
    })

    res.status(200).send("Received!")
  })

  const port = 5643
  app.listen(port)

}