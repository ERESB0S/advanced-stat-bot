const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const settings = require("./src/configs/settings.json");
const client = (global.client = new Client({
  intents: Object.keys(GatewayIntentBits),
  partials: Object.keys(Partials),
}));

client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();

require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.token)
  .then(() => console.log("[BOT] Bot bağlantısı başarıyla kuruldu!"))
  .catch(() => console.error("[BOT] Bot bağlantısı kurulurken bir hata oluştu!"));
