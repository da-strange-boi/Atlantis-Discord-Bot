# Self hosting
The bot uses `MongoDB` as its main database. The data in `config.json` also needs to be filled out

## config.json
```json
{
    "BOT_TOKEN": "<BOT TOKEN>",
    "BOT_ADMINS": ["<ARRAY OF USER IDs (first one must be the owner ID)>"],
    "TIMEZONE": "<YOUR TIMEZONE IN TZ FORMAT>"
}
```

Once everything is setup and NPM packages are installed run the bot by doing `npm run bot`

---
Original bot code can be found [here](https://github.com/da-strange-boi/Atlantis-Discord-Bot/tree/last-public)