const config = require("../configs/config.json");
const points = require("../schemas/points");
const ranks = require("../schemas/ranks");

module.exports = {
  conf: {
    aliases: ["senkronize"],
    name: "senkron",
    help: "senkron [Kullanıcı/Rol] [@Eresbos/@Rol/ID]",
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
    const ranksData = await ranks.findOne({ guildId: message.guild.id });
    if (!message.member.permissions.has("Administrator")) return;
    if (!ranksData.pointSystem) return message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi aktif değil!")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
    if (["member", "kişi", "user", "kullanıcı"].some((e) => args[0] === e)) {
      if (!args[1]) return message.reply({ embeds: [eresbosEmbed.setDescription("Üzgünüm dostum fakat geçerli bir kullanıcı belirtmelisin.")] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
      if (!member) return message.reply({ embeds: [eresbosEmbed.setDescription("Üzgünüm dostum fakat belirttiğin kullanıcıyı bulamıyorum.")] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));

      if (ranksData.ranks.some((e) => member.hasRole(e.rank))) {
        const ranks = ranksData.ranks.filter((e) => member.hasRole(e.rank)).last();
        message.reply({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısında <@&${ranks.rank}>${ranks.hammers.length > 0 ? ` (${ranks.hammers.map((e) => `<@&${e}>`).join(", ")})` : ""} rolü bulundu ve puanı \`${Number(ranks.points).toLocaleString()}\` olarak değiştirildi.`)] }).then(() => message.react(config.emojis.onay));
        await points.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { points: ranks.points } }, { upsert: true });
      } else return message.reply({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısında ayarlı yetkili rolü bulunamadı!`)] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
    } else if (["rol", "role"].some((e) => args[0] === e)) {
      if (!args[1]) return message.reply({ embeds: [eresbosEmbed.setDescription("Üzgünüm dostum fakat geçerli bir rol belirtmelisin.")] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
      const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if (!rol) return message.reply({ embeds: [eresbosEmbed.setDescription("Üzgünüm dostum fakat belirttiğin rolü bulamıyorum.")] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
      if (rol.members.length === 0) return message.reply({ embeds: [eresbosEmbed.setDescription("Belirttiğin rolde kullanıcı bulunmadığı için işlem iptal edildi.")] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));

      rol.members.forEach(async (member) => {
        if (member.user.bot) return;
        if (ranksData.ranks.some((e) => member.hasRole(e.rank))) {
          const ranks = ranksData.ranks.filter((e) => member.hasRole(e.rank)).last();
          message.channel.send({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısında <@&${ranks.rank}>${ranks.hammers.length > 0 ? ` (${ranks.hammers.map((e) => `<@&${e}>`).join(", ")})` : ""} rolü bulundu ve puanı \`${Number(ranks.points).toLocaleString()}\` olarak değiştirildi.`)] }).then(() => message.react(config.emojis.onay));
          await points.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { points: ranks.points } }, { upsert: true });
        } else return message.channel.send({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısında ayarlı yetkili rolü bulunamadı!`)] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
      });
    } else return message.reply({ embeds: [eresbosEmbed.setDescription("Üzgünüm dostum fakat bir argüman belirtmelisin! `Kullanıcı-Rol`")] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
  }
};
