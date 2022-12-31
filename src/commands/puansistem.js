const config = require("../configs/config.json");
const ranks = require("../schemas/ranks");

module.exports = {
  conf: {
    aliases: ["pointsystem"],
    name: "puansistem",
    help: "puansistem [aç-kapat]",
    category: "Yetkili",
    enabled: true,
  },

  /**
   * @param { import("discord.js").Client } client 
   * @param { import("discord.js").Message } message 
   * @param { Array<String> } args 
   * @param { import("discord.js").EmbedBuilder } eresbosEmbed 
   * @returns 
   */
  run: async (client, message, args, eresbosEmbed) => {
    if (!message.member.permissions.has("Administrator") && !config.pointStaff.some((role) => message.member.roles.cache.has(role))) return;
    if (!args[0]) return message.reply({ embeds: [eresbosEmbed.setDescription("Lütfen bir argüman belirtin! `aç` veya `kapat`.")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
    const ranksData = await ranks.findOne({ guildId: message.guild.id });
    if (["aç", "open"].includes(args[0])) {
      if (ranksData.pointSystem === true) return message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi zaten açık!")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi başarıyla `aktif edildi!`")] }).then((e) => setTimeout(() => e.delete(), 15000) && message.react(config.emojis.onay));
      ranksData.pointSystem = true;
      await ranksData.save();
    } else if (["kapat", "close"].includes(args[0])) {
      if (ranksData.pointSystem === false) return message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi zaten kapalı!")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi başarıyla `deaktif edildi!`")] }).then((e) => setTimeout(() => e.delete(), 15000) && message.react(config.emojis.onay));
      ranksData.pointSystem = false;
      await ranksData.save();
    }
  }
};
