const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const messageUserChannel = require("../schemas/messageUserChannel");
const voiceUser = require("../schemas/voiceUser");
const voiceUserChannel = require("../schemas/voiceUserChannel");
const voiceUserParent = require("../schemas/voiceUserParent");

module.exports = {
  conf: {
    aliases: ["me", "stats"],
    name: "stat",
    help: "stat <@Eresbos/ID>",
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
  run: async (client, message, args, eresbosEmbed) => {
    const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: kullanıcı.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: kullanıcı.id });
    const mesajVeriler = await messageUserChannel.find({ guildID: message.guild.id, userID: kullanıcı.id }).sort({ channelData: -1 });
    const sesVeriler = await voiceUserChannel.find({ guildID: message.guild.id, userID: kullanıcı.id }).sort({ channelData: -1 });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("statmenu")
        .setPlaceholder("İstatistik Menüsü")
        .addOptions([
          { label: "Kanal İstatistikleri", description: "Toplam kanal istatistiklerini görüntülemek için tıkla.", value: "topChannel", emoji: "1004168367114047629" },
          { label: "Toplam İstatistik", description: "Toplam istatistikleri görüntülemek için tıkla.", value: "topStat", emoji: "1004168367114047629" },
          { label: "1 Günlük İstatistik", description: "1 günlük istatistikleri görüntülemek için tıkla.", value: "dailyStat", emoji: "1004168367114047629" },
          { label: "1 Haftalık İstatistik", description: "1 haftalık istatistikleri görüntülemek için tıkla.", value: "weeklyStat", emoji: "1004168367114047629" },
          { label: "Menüyü Kapat", description: "Menüyü kapatmak için tıkla.", value: "statmenuclose", emoji: "969684766716739624" }
        ]),
    );

    let messageTop;
    let voiceTop;
    const kanalSayısı = sesVeriler ? sesVeriler.length : 0;
    mesajVeriler.length > 0 ? messageTop = mesajVeriler.splice(0, 10).map((e, i) => `\`${i + 1}.\` ${message.guild.channels.cache.get(e.channelID) ? capitalizeIt(message.guild.channels.cache.get(e.channelID).name.replace("#", "").replace("-", " ")) : "Kanal Silinmiş"}: \`${Number(e.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "`Veri Bulunamadı!`";
    sesVeriler.length > 0 ? voiceTop = sesVeriler.splice(0, 10).map((e, i) => `\`${i + 1}.\` ${message.guild.channels.cache.get(e.channelID) ? message.guild.channels.cache.get(e.channelID).name : "Kanal Silinmiş"}: \`${client.getTime(e.channelData)}\``).join("\n") : voiceTop = "`Veri bulunamadı!`";

    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({ guildID: message.guild.id, userID: kullanıcı.id });
      const voiceUserParentData = data.filter((e) => parentsArray.includes(e.parentID));
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserParentData.length; i++) {
        voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
      }
      return voiceStat;
    };
    const channel = async (channelsArray) => {
      const data = await voiceUserChannel.find({ guildID: message.guild.id, userID: kullanıcı.id });
      const voiceUserChannelData = data.filter((e) => channelsArray.includes(e.channelID));
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserChannelData.length; i++) {
        voiceStat += voiceUserChannelData[i] ? voiceUserChannelData[i].channelData : 0;
      }
      return voiceStat;
    };

    const filteredParents = message.guild.channels.cache.filter((e) =>
      e.type === "category" &&
      !config.publicParents.includes(e.id) &&
      !config.registerParents.includes(e.id) &&
      !config.crewParents.includes(e.id) &&
      !config.streamParents.includes(e.id) &&
      !config.problemParents.includes(e.id) &&
      !config.gameParents.includes(e.id) &&
      !config.secretParents.includes(e.id) &&
      !config.aloneParents.includes(e.id)
    );

    let parents = [
      { name: "Public Odalar", data: await category(config.publicParents) },
      { name: "Kayıt Odaları", data: await category(config.registerParents) },
      { name: "Ekip Odaları", data: await category(config.crewParents) },
      { name: "Yayın Odaları", data: await category(config.streamParents) },
      { name: "Sorun Çözme Odaları", data: await category(config.problemParents) },
      { name: "Eğlence Odaları", data: await category(config.gameParents) },
      { name: "Secret Odalar", data: await category(config.secretParents) },
      { name: "Alone Odalar", data: await category(config.aloneParents) },
      { name: "Sleep Room", data: await channel(config.sleepRoom) },
      { name: "Diğer", data: await category(filteredParents.map(e => e.id)) },
    ];
    parents = parents.filter((e) => e.data !== 0).sort((a, b) => b.data - a.data);

    eresbosEmbed.setThumbnail(kullanıcı.user.avatarURL({ dynamic: true })).setDescription(`${kullanıcı.user.toString()} kullanıcısının genel sunucu ses ve mesaj istatistikleri;`);
    const mesaj = await message.reply({ components: [row] });
    message.react(config.emojis.onay);
    const filter = (e) => e.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async (menu) => {
      if (menu.customId === "statmenu") {
        await menu.deferUpdate();
        if (menu.values[0] === "topChannel") {
          if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setFields(
            { name: "❯ Kategori Bilgileri:", value: `\`•\` Toplam: \`${voiceData ? client.getTime(voiceData.topStat) : "`Veri bulunamadı!`"}\` \n${parents.length > 0 ? parents.map((e) => `\`•\` ${e.name}: \`${client.getTime(e.data)}\``).join("\n") : ""}` },
            { name: `❯ Ses Sıralaması: (Toplam ${kanalSayısı} Kanal)`, value: voiceTop },
            { name: `❯ Mesaj Sıralaması: (Toplam: ${messageData ? Number(messageData.topStat).toLocaleString() : 0} Mesaj)`, value: messageTop },
          )] });          
        } else if (menu.values[0] === "topStat") {
          if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setFields(
            { name: "❯ Mesaj Bilgileri:", value: `\`•\` Toplam: \`${messageData ? Number(messageData.topStat).toLocaleString() : "`Veri bulunamadı!`"}\``, inline: true },
            { name: "❯ Ses Bilgileri:", value: `\`•\` Toplam: \`${voiceData ? client.getTime(voiceData.topStat) : "`Veri bulunamadı!`"}\``, inline: true },
          )] });
        } else if (menu.values[0] === "dailyStat") {
          if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setFields(
            { name: "❯ Mesaj Bilgileri:", value: `\`•\` 1 Günlük: \`${messageData ? Number(messageData.dailyStat).toLocaleString() : "`Veri bulunamadı!`"}\``, inline: true },
            { name: "❯ Ses Bilgileri:", value: `\`•\` 1 Günlük: \`${voiceData ? client.getTime(voiceData.dailyStat) : "`Veri bulunamadı!`"}\``, inline: true },
          )] });
        } else if (menu.values[0] === "weeklyStat") {
          if (mesaj) mesaj.edit({ embeds: [eresbosEmbed.setFields(
            { name: "❯ Mesaj Bilgileri:", value: `\`•\` 1 Haftalık: \`${messageData ? Number(messageData.weeklyStat).toLocaleString() : "`Veri bulunamadı!`"}\``, inline: true },
            { name: "❯ Ses Bilgileri:", value: `\`•\` 1 Haftalık: \`${voiceData ? client.getTime(voiceData.weeklyStat) : "`Veri bulunamadı!`"}\``, inline: true },
          )] });
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

function capitalizeIt(str) {
  if (str && typeof (str) === "string") {
    str = str.split(" ");
    for (var i = 0, x = str.length; i < x; i++) {
      if (str[i]) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }
    }
    return str.join(" ");
  } return str;
};
