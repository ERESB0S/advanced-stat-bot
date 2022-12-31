const config = require("../configs/config.json");
const ranks = require("../schemas/ranks");

module.exports = {
  conf: {
    aliases: ["yetki", "rütbe"],
    name: "rank",
    category: "Owner",
    enabled: true,
  },

  /**
   * @param { import("discord.js").Client } client 
   * @param { import("discord.js").Message } message 
   * @param { Array<String> } args 
   * @param { import("discord.js").EmbedBuilder } eresbosEmbed 
   */
  run: async (client, message, args, eresbosEmbed, prefix) => {
    if (!message.member.permissions.has("Administrator")) return;
    const ranksData = await ranks.findOne({ guildId: message.guild.id });
    if (!ranksData.pointSystem) return message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi aktif değil!")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
    if (!args[0]) return message.reply({ embeds: [eresbosEmbed.setDescription(`Lütfen bir argüman belirtin! \n\`${prefix}rank [ekle-çıkar-liste]\``)] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
    if (["ekle", "add"].includes(args[0])) {
      if (!args[1] || isNaN(args[1])) return message.reply({ embeds: [eresbosEmbed.setDescription(`Lütfen bir puan belirtin! \n\`${prefix}rank ekle [puan] [rol] - [yardımcı roller]\``)] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      if (ranksData.ranks.some((e) => e.points == args[1])) return message.reply({ embeds: [eresbosEmbed.setDescription(`Bu puana sahip bir yetki zaten mevcut!`)] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      const args2 = args.splice(2).join(" ").split(" - ");
      if (!args2) return message.reply({ embeds: [eresbosEmbed.setDescription(`Lütfen bir rol belirtin! \n\`${prefix}rank ekle [puan] [rol] - [yardımcı roller]\``)] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      const role = args2[0].split(" ").map((e) => e.replace(/<@&/g, "").replace(/>/g, ""));
      let hammers;
      if (args2[1]) hammers = args2[1].split(" ").map((e) => e.replace(/<@&/g, "").replace(/>/g, ""));
      else null;
      message.reply({ embeds: [eresbosEmbed.setDescription(`\`${Number(args[1]).toLocaleString()}\` puana ulaşınca verilecek yetki ayarlandı. \n\n**❯ Verilecek Yetki:** \n<@&${role}> ${hammers ? `\n\n**❯ Hammer Rolleri:** \n${hammers.map((e) => `<@&${e}>`).join("\n")}` : ""}`)] }).then((e) => setTimeout(() => e.delete(), 20000) && message.react(config.emojis.onay));
      await ranksData.ranks.push({ rank: String(role), hammers: hammers ? hammers : [], points: Number(args[1]) });
      await ranksData.save();
    } else if (["kaldır", "remove"].includes(args[0])) {
      if (!args[1] || isNaN(args[1])) return message.reply({ embeds: [eresbosEmbed.setDescription(`Lütfen bir puan belirtin! \n\`${prefix}rank kaldır [puan]\``)] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      if (!ranksData.ranks.some((e) => e.points == args[1])) return message.reply({ embeds: [eresbosEmbed.setDescription(`Bu puana sahip bir yetki bulunamadı!`)] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      message.reply({ embeds: [eresbosEmbed.setDescription(`\`${Number(args[1]).toLocaleString()}\` puana sahip olan yetki kaldırıldı.`)] }).then((e) => setTimeout(() => e.delete(), 20000) && message.react(config.emojis.onay));
      await ranksData.ranks.splice(ranksData.ranks.findIndex((e) => e.points == args[1]), 1);
      await ranksData.save();
    } else if (["liste", "list"].includes(args[0])) {
      if (!ranksData.ranks.length) return message.reply({ embeds: [eresbosEmbed.setDescription("Bu sunucuda hiçbir yetki ayarlanmamış!")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
      message.reply({ embeds: [eresbosEmbed.setDescription(`${ranksData.ranks.length > 0 ? ranksData.ranks.sort((a, b) => a.points - b.points).map((e) => `\`❯\` <@&${e.rank}>${e.hammers.length > 0 ? ` (${e.hammers.map((h) => `<@&${h}>`).join(", ")})` : ""}: \`${Number(e.points).toLocaleString()} puan\``).join("\n") : ""}`)] }).then(message.react(config.emojis.onay));
    }
  }
};
