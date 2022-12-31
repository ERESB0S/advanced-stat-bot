const config = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: [],
    name: "reload",
    category: "Owner",
    owner: true,
    enabled: true
  },

  /**
   * @param { import("discord.js").Client } client 
   * @param { import("discord.js").Message } message 
   * @param { Array<String> } args 
   * @returns 
   */
  run: async (client, message, args) => {
    if (!args[0]) {
      await message.reply({ content: "Bot yeniden başlatılıyor!" }).then(() => message.react(config.emojis.onay));
      console.log("[BOT] Bot yeniden başlatıldı.");
      process.exit(0);
    } else {
      const command = args[0];
      let category = client.commands.get(command);
      if (!category) return message.reply({ content: "Geçerli bir kod ismi belirtmelisin!" }).then((e) => message.react(config.emojis.red) && setTimeout(() => e.delete(), 10000));
      category = category.conf.category.replace("Yetkili", "yetkili").replace("Genel", "genel");
      try {
        const msg = await message.reply({ content: `\`${command}\` adlı komut yeniden başlatılıyor!` });
        delete require.cache[require.resolve(`./${command}.js`)];
        client.commands.delete(command);
        client.commands.set(command, require(`./${command}.js`));
        console.log(`[COMMAND] ${command} adlı komut yeniden başlatıldı`);
        msg.edit({ content: `\`${command}\` adlı komut yeniden başlatıldı!` }).then((e) => message.react(config.emojis.onay) && setTimeout(() => e.delete(), 10000));
      } catch (e) {
        console.log(e);
        return message.reply({ content: `\`${command}\` adlı komut yeniden başlatılamadı!` }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
      }
    }
  }
};
