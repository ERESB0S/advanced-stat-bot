const config = require("../configs/config.json");
const points = require("../schemas/points");
const ranks = require("../schemas/ranks");

module.exports = {
  conf: {
    aliases: ["point", "points"],
    name: "puan",
    help: "puan [ekle-çıkar-gönder] [@Eresbos/ID] [Miktar]",
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
    if (!ranksData.pointSystem) return message.reply({ embeds: [eresbosEmbed.setDescription("Puan sistemi aktif değil!")] }).then((e) => setTimeout(() => e.delete(), 5000) && message.react(config.emojis.red));
    if (!args[0]) return message.reply({ content: "Hatalı komut kullanımı! Lütfen yapacağınız işlemi belirtin; `[ekle-çıkar-gönder]`" }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    const rankLog = message.guild.channels.cache.get(config.rankLog);
    if (args[0] === "ekle" || args[0] === "add") {
      if (!message.member.permissions.has("Administrator") && !config.pointStaff.some((e) => message.member.roles.cache.has(e))) return;
      if (!member) return message.reply({ content: "Lütfen puan eklemek istediğiniz memberyı belirtin." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      if (member.user.id === message.author.id) return message.reply({ content: "Üzgünüm dostum fakat kendine puan ekleyemezsin." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      const puan = Number(args[2]);
      if (!puan) return message.reply({ content: "Eklenecek puan miktarını belirtmelisin." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      if (puan < 1) return message.reply({ content: "Eklenecek puan miktarı 1'den küçük olamaz." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));

      await points.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { points: puan } }, { upsert: true });
      const pointData = await points.findOne({ guildID: message.guild.id, userID: member.user.id });
      let addedRoles = "";
      if (pointData && pointData.ranks.some((e) => pointData.points >= e.points && !member.hasRole(e.rank))) {
        const roles = pointData.ranks.filter((e) => pointData.points >= e.points && !member.hasRole(e.rank));
        addedRoles = roles;
        member.roles.add(roles[roles.length - 1].rank);
        if (rankLog) rankLog.send({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısına ${message.member.toString()} tarafından \`${puan}\` puan eklendi ve ${roles.filter(e => roles.indexOf(e) === roles.length - 1).map(e => (Array.isArray(e.rank) ? e.rank.listRoles() : `<@&${e.rank}>`)).join("\n")} rolleri verildi!`)] });
      }
      message.reply({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısına \`${puan}\` adet puan eklendi! \n\n${addedRoles.length > 0 ? `Verilen roller: \n${addedRoles.filter(e => addedRoles.indexOf(e) === addedRoles.length - 1).map(e => `<@&${e.rank}>`).join("\n")}` : ""}`)] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.onay));
    } else if (args[0] === "çıkar" || args[0] === "sil" || args[0] === "remove") {
      if (!message.member.permissions.has("Administrator") && !config.pointStaff.some((e) => message.member.roles.cache.has(e))) return;
      if (!member) return message.reply({ content: "Lütfen puan silmek istediğiniz memberyı belirtin." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      if (member.user.id === message.author.id) return message.reply({ content: "Üzgünüm dostum fakat kendine puan ekleyemezsin." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      const puan = Number(args[2]);
      if (!puan) return message.reply({ content: "Çıkarmak istediğin puan miktarını belirtmelisin." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      if (puan < 1) return message.reply({ content: "Çıkarmak istediğin puan miktarı 1'den küçük olamaz." }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      let pointData = await points.findOne({ guildID: message.guild.id, userID: member.user.id });
      if (!pointData || pointData && puan > pointData.points) return message.reply({ content: "Çıkarmak istediğiniz sayı, kişinin mevcut puanından büyük olamaz!" }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));

      await points.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { points: -puan } }, { upsert: true });
      pointData = await points.findOne({ guildID: message.guild.id, userID: member.user.id });
      let removedRoles = "";
      if (pointData && pointData.ranks.some(e => pointData.points < e.points && member.hasRole(e.rank))) {
        const roles = pointData.ranks.filter(e => pointData.points < e.points && member.hasRole(e.rank));
        removedRoles = roles;
        roles.forEach(e => {
          member.roles.remove(e.rank);
        });
        if (rankLog) rankLog.send({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısından ${message.member.toString()} tarafından \`${puan}\` adet puan çıkarıldı ve kişiden <@&${roles.rank}}> rolleri alındı!`)] });
      }
      message.reply({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kullanıcısından \`${puan}\` adet puan çıkarıldı! \n\n${removedRoles.length > 0 ? `Alınan roller: \n${removedRoles.rank.listRoles()}` : ""}`)] }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.onay));
    } else if (args[0] === "gönder" || args[0] === "ver" || args[0] === "yolla") {
      if (member.user.id === message.author.id) return message.reply({ content: "Üzgünüm dostum fakat kendi kendine puan gönderemezsin!" });
      const puan = Number(args[2]);
      if (!puan) return message.reply({ content: "Vermek istediğin puan sayısını belirtmelisin!" }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      if (puan < 1) return message.reply({ content: "Verilecek sayı 1'dan küçük olamaz!" }).them((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));
      let pointData = await points.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (!pointData || pointData && puan > pointData.points) return message.reply({ content: "Göndereceğin puan kendi puanından yüksek olamaz!" }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.red));

      await points.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { points: puan } }, { upsert: true });
      await points.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { points: -puan } }, { upsert: true });
      pointData = await points.findOne({ guildID: message.guild.id, userID: message.author.id });
      if (pointData && pointData.ranks.some(e => pointData.points < e.points && message.member.hasRole(e.rank))) {
        const roles = pointData.ranks.filter(e => pointData.points < e.points && message.member.hasRole(e.rank));
        roles.forEach(e => {
          message.member.roles.remove(e.rank);
        });
      }
      const pointData2 = await points.findOne({ guildID: message.guild.id, userID: member.user.id });
      if (pointData2 && pointData.ranks.some(e => pointData2.points >= e.points && !member.hasRole(e.rank))) {
        const roles = pointData.ranks.filter(e => pointData2.points >= e.points && !member.hasRole(e.rank));
        member.roles.add(roles[roles.length - 1].rank);
      }

      message.reply({ embeds: [eresbosEmbed.setDescription(`${member.toString()} kişisine başarıyla \`${puan}\` puan gönderildi!`)] }).then((e) => setTimeout(() => e.delete(), 7000) && message.react(config.emojis.onay));
    }
  }
};
