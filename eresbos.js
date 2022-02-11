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
  { rankRole: "Yetki Rol ID", hammers: ["Hammer 1 ID", "Hammer 2 Id"], points: 1 }
];

require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.loginKey)
  .then(() => console.log("[BOT] Bot bağlantısı başarıyla kuruldu!"))
  .catch(() => console.error("[BOT] Bot bağlantısı kurulurken bir hata oluştu!"));
