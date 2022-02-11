const { Client, Collection } = require("discord.js");
const settings = require("./src/configs/settings.json");
const config = require("./src/configs/config.json");
const client = (global.client = new Client({
  fetchAllMembers: true,
  disableMentions: "everyone",
  presence: {
    activity: {
      name: config.activity,
      type: config.type
    },
    status: config.status
  },
  partials: ["USER", "GUILD_MEMBER", "CHANNEL"],
  ws: {
    intents: [
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_MESSAGES",
      "GUILD_VOICE_STATES"
    ]
  }
}));
client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();
client.ranks = [
  { rankRole: "910124121009057832", hammers: ["917391685074436096"], points: 15 },
  { rankRole: "910126892546400256", hammers: ["910884461569253437"], points: 17 },
  { rankRole: "910123113738563634", hammers: ["910886138133250078"], points: 20 }
];

require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.loginKey)
  .then(() => console.log("[BOT] Bot bağlantısı başarıyla kuruldu!"))
  .catch(() => console.error("[BOT] Bot bağlantısı kurulurken bir hata oluştu!"));
