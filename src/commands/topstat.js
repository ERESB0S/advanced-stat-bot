const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../configs/config.json");
const moment = require("moment");
require("moment-duration-format");
const messageGuild = require("../schemas/messageGuild");
const messageGuildChannel = require("../schemas/messageGuildChannel");
const voiceGuild = require("../schemas/voiceGuild");
const voiceGuildChannel = require("../schemas/voiceGuildChannel");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const points = require("../schemas/points");
const ranks = require("../schemas/ranks");

module.exports = {
  conf: {
    aliases: ["topstats"],
    name: "topstat",
    help: "topstat <@Rol/ID>",
    category: "Genel",
    enabled: true
  },

  /**
   * @param { import("discord.js").Client } client 
   * @param { import("discord.js").Message } message 
   * @param { Array<String> } args 
   * @param { import("discord.js").EmbedBuilder } eresbosEmbed 
   * @returns 
   */
  run: async (client, message, args, eresbosEmbed, prefix) => {
    const messageChannelData = await messageGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
    const voiceChannelData = await voiceGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
    const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const voiceUsersData = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id });
    const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });
    const pointData = await points.find({ guildID: message.guild.id }).sort({ points: -1 });
    const ranksData = await ranks.find({ guildId: message.guild.id });
    let pointSum = 0;

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("topstatmenu")
        .setPlaceholder("Toplam İstatistik Menüsü")
        .addOptions(
          { label: "Toplam", description: "Toplam istatistikleri görmek için tıklayın.", value: "topstat", emoji: "1004168367114047629" },
          { label: "Ses", description: "Ses istatistikleri görmek için tıklayın.", value: "voicestat", emoji: "1004168367114047629" },
          { label: "Mesaj", description: "Mesaj istatistikleri görmek için tıklayın.", value: "messagestat", emoji: "1004168367114047629" },
          { label: "Puan", description: "Puan istatistikleri görmek için tıklayın.", value: "pointstat", emoji: "1004168367114047629" },
          { label: "Menüyü Kapat", description: "Menüyü kapatmak için tıkla.", value: "statmenuclose", emoji: "969684766716739624" }
        )
    );

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (args[0] && !role) return message.reply({ content: "Üzgünüm dostum fakat belirttiğin rolü bulamıyorum. Lütfen geçerli bir rol veya rol id'si belirt." }).then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));
    const mesaj = await message.reply({ components: [row] });
    message.react(config.emojis.onay);
    const filter = (e) => e.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async (menu) => {
      if (menu.customId === "topstatmenu") {
        await menu.deferUpdate();
        if (menu.values[0] === "topstat") {
          if (role) {
            const voiceData = async (type) => {
              let data = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
              data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
              return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${client.getTime(e[type])}\``).join("\n") : "`Veri bulunmuyor.`";
            };
            const messageData = async (type) => {
              let data = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
              data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
              return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${Number(e[type]).toLocaleString()} mesaj\``).join("\n") : "`Veri bulunmuyor.`";
            };
            const pointData = async () => {
              let data = await points.find({ guildID: message.guild.id }).sort({ points: -1 });
              data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
              return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``).join("\n") : "`Veri bulunmuyor.`";
            };
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`${role.toString()} rolüne sahip üyelerin **toplam** istatistik verileri; \n\n**❯ Ses Bilgileri:** \n${await voiceData("topStat")} \n\n**❯ Mesaj Bilgileri:** \n${await messageData("topStat")} \n\n${ranksData.pointSystem && ranksData.ranks.length >= 1 ? `**❯ Puan Bilgileri:** \n${await pointData()}` : ""}`)] });
          } else {
            const messageChannels = messageChannelData.splice(0, 10).map((e, i) => `\`${i + 1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${Number(e.channelData).toLocaleString()} mesaj\``).join("\n");
            const voiceChannels = voiceChannelData.splice(0, 10).map((e, i) => `\`${i + 1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${client.getTime(e.channelData)}\``).join("\n");
            const messageUsers = messageUsersData.splice(0, 10).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.topStat).toLocaleString()} mesaj\``).join("\n");
            const voiceUsers = voiceUsersData.splice(0, 10).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${client.getTime(e.topStat)}\``).join("\n");
            const pointUsers = pointData.splice(0, 10).map((e, i) => {
              pointSum += e.points;
              return `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``;
            }).join("\n");
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`**${message.guild.name}** adlı sunucunun **toplam** istatistik verileri; \n\n**❯ Ses Bilgileri: (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("M [ay], d [gün], H [saat] m [dk], s [sn].")}\`)** \n${voiceUsers.length > 0 ? voiceUsers : "`Veri Bulunmuyor.`"} \n\n**❯ Ses Kanal Bilgileri:** \n${voiceChannels.length > 0 ? voiceChannels : "`Veri Bulunmuyor.`"} \n\n**❯ Mesaj Bilgileri: (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)** \n${messageUsers.length > 0 ? messageUsers : "`Veri Bulunmuyor.`"} \n\n**❯ Mesaj Kanal Bilgileri:** \n${messageChannels.length > 0 ? messageChannels : "`Veri Bulunmuyor.`"} \n\n${ranksData.pointSystem && ranksData.ranks.length >= 1 ? `**❯ Puan Bilgileri: (\`Toplam ${pointSum.toLocaleString()}\`)** \n${pointUsers.length > 0 ? pointUsers : "`Veri Bulunmuyor.`"}` : ""}`)] });
          }
        } else if (menu.values[0] === "voicestat") {
          if (role) {
            const voiceData = async (type) => {
              let data = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
              data = data.filter((e) => e[type] !== 0 && message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
              return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${client.getTime(e[type])}\``).join("\n") : "`Veri bulunmuyor.`";
            };
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`${role.toString()} rolüne sahip üyelerin **toplam ses** istatistik verileri; \n\n**❯ Toplam Ses Bilgileri:** \n${await voiceData("topStat")} \n\n**❯ Haftalık Ses Bilgileri:** \n${await voiceData("weeklyStat")} \n\n**❯ Günlük Ses Bilgileri:** \n${await voiceData("dailyStat")}`)] });
          } else {
            const voiceChannels = voiceChannelData.splice(0, 20).map((e, i) => `\`${i + 1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${client.getTime(e.channelData)}\``).join("\n");
            const voiceUsers = voiceUsersData.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${client.getTime(e.topStat)}\``).join("\n");
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`**${message.guild.name}** adlı sunucunun **toplam ses** istatistik verileri; \n\n**❯ Ses Bilgileri: (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("M [ay], d [gün], H [saat] m [dk], s [sn].")}\`)** \n${voiceUsers.length > 0 ? voiceUsers : "`Veri Bulunmuyor.`"} \n\n **❯ Ses Kanal Bilgileri:** \n${voiceChannels.length > 0 ? voiceChannels : "`Veri Bulunmuyor.`"}`)] });
          }
        } else if (menu.values[0] === "messagestat") {
          if (role) {
            const messageData = async (type) => {
              let data = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
              data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
              return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${Number(e[type]).toLocaleString()} mesaj\``).join("\n") : "`Veri bulunmuyor.`";
            };
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`${role.toString()} rolüne sahip üyelerin **toplam mesaj** istatistik verileri; \n\n**❯ Toplam Mesaj Bilgileri:** \n${await messageData("topStat")} \n\n**❯ Haftalık Mesaj Bilgileri:** \n${await messageData("weeklyStat")} \n\n**❯ Günlük Mesaj Bilgileri:** \n${await messageData("dailyStat")}`)] });
          } else {
            const messageChannels = messageChannelData.splice(0, 20).map((e, i) => `\`${i + 1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${Number(e.channelData).toLocaleString()} mesaj\``).join("\n");
            const messageUsers = messageUsersData.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.topStat).toLocaleString()} mesaj\``).join("\n");
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`**${message.guild.name}** adlı sunucunun **toplam mesaj** istatistik verileri; \n\n**❯ Mesaj Bilgileri: (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)** \n${messageUsers.length > 0 ? messageUsers : "`Veri Bulunmuyor.`"} \n\n**❯ Mesaj Kanal Bilgileri:** \n${messageChannels.length > 0 ? messageChannels : "`Veri Bulunmuyor.`"}`)] });
          }
        } else if (menu.values[0] === "pointstat") {
          if (!ranksData.pointSystem || ranksData.ranks.length === 0) {
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription("Üzgünüm fakat puan sistemi devre dışı olduğu için veya rütbe sistemi ayarlı olmadığı için bu bilgiye ulaşamıyorum.")] });
            return;
          }
          if (role) {
            const pointData = async () => {
              let data = await points.find({ guildID: message.guild.id }).sort({ points: -1 });
              data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
              return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``).join("\n") : "`Veri bulunmuyor.`";
            };
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`${role.toString()} rolüne sahip üyelerin **toplam puan** istatistik verileri; \n\n**❯ Toplam Puan Bilgileri:** \n${await pointData()}`)] });
          } else {
            const pointUsers = pointData.splice(0, 20).map((e, i) => {
              pointSum += e.points;
              return `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``;
            }).join("\n");
            if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setDescription(`**${message.guild.name}** adlı sunucunun **toplam puan** istatistik verileri; \n\n**❯ Puan Bilgileri: (\`Toplam ${pointSum.toLocaleString()}\`)** \n${pointUsers.length > 0 ? pointUsers : "`Veri Bulunmuyor.`"}`)] });
          }
        } else if (menu.values[0] === "statmenuclose") {
          row.components[0].setDisabled(true);
          if (mesaj) mesaj.edit({ embeds: [], components: [row] });
          collector.stop();
        }
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason === "time") {
        row.components[0].setDisabled(true);
        if (mesaj) mesaj.edit({ embeds: [], components: [row] });
      }
    });
  }
};
