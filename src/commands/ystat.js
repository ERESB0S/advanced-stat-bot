const config = require("../configs/config.json");
const ms = require("ms");
const voiceUserParent = require("../schemas/voiceUserParent");
const messageUser = require("../schemas/messageUser");
const points = require("../schemas/points");
const ranks = require("../schemas/ranks");

module.exports = {
  conf: {
    aliases: ["yme", "ystats"],
    name: "ystat",
    help: "ystat <@Eresbos/ID>",
    category: "Yetkili",
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
    if (!message.member.permissions.has("Administrator") && !config.staffRoles.some((e) => message.member.roles.cache.has(e))) return;
    const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!kullanıcı.permissions.has("Administrator") && !config.staffRoles.some((e) => kullanıcı.roles.cache.has(e))) return message.reply("Belirttiğin kullanıcı yetkili değil.").then((e) => setTimeout(() => e.delete(), 10000) && message.react(config.emojis.red));

    const pointData = await points.findOne({ guildID: message.guild.id, userID: kullanıcı.id });
    const ranksData = await ranks.findOne({ guildId: message.guild.id });
    const pubVeriler = await voiceUserParent.findOne({ guildID: message.guild.id, userID: kullanıcı.id, parentID: config.publicParents });
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: kullanıcı.id });

    if (parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vbronze)) {
      if ([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vdia, config.badges.vemerl].some((e) => kullanıcı.roles.cache.get(e))) kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vdia, config.badges.vemerl]).catch(() => { });
      eresbosEmbed.addFields({ name: "❯ Ses Rozet Durumu:", value: `Üzgünüm dostum fakat bir rozete sahip değilsin. ${message.guild.roles.cache.get(config.badges.vbronze)} rozetini almak için public kanallarda \`${client.getTime(ms(config.targetAmount.vbronze) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
    }
    if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vbronze) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vsilver)) {
      if (!kullanıcı.roles.cache.has(config.badges.vbronze)) {
        await kullanıcı.roles.add(config.badges.vbronze);
        kullanıcı.roles.remove([config.badges.vsilver, config.badges.vgold, config.badges.vdia, config.badges.vemerl]);
        eresbosEmbed.addFields({ name: "❯ Yeni Ses Rozeti!", value: `Tebrikler dostum! :tada: Public kanallarda \`${client.getTime(ms(config.targetAmount.vbronze))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vbronze)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vsilver)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vsilver) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Ses Rozet Durumu:", value: `Tebrikler **${message.guild.roles.cache.get(config.badges.vbronze)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vsilver)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vsilver) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      }
    }
    if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vsilver) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vgold)) {
      if (!kullanıcı.roles.cache.has(config.badges.vsilver)) {
        await kullanıcı.roles.add(config.badges.vsilver);
        kullanıcı.roles.remove([config.badges.vbronze, config.badges.vgold, config.badges.vdia, config.badges.vemerl]);
        eresbosEmbed.addFields({ name: "❯ Yeni Ses Rozeti!", value: `Tebrikler dostum! :tada: Public kanallarda \`${client.getTime(ms(config.targetAmount.vsilver))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vsilver)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vgold)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vgold) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Ses Rozet Durumu:", value: `Tebrikler **${message.guild.roles.cache.get(config.badges.vsilver)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vgold)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vgold) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      }
    }
    if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vgold) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vdia)) {
      if (!kullanıcı.roles.cache.has(config.badges.vgold)) {
        await kullanıcı.roles.add(config.badges.vgold);
        kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vdia, config.badges.vemerl]);
        eresbosEmbed.addFields({ name: "❯ Yeni Ses Rozeti!", value: `Tebrikler dostum! :tada: Public kanallarda \`${client.getTime(ms(config.targetAmount.vgold))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vgold)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vdia)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vdia) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Ses Rozet Durumu:", value: `Tebrikler **${message.guild.roles.cache.get(config.badges.vgold)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vdia)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vdia) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      }
    }
    if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vdia) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vemerl)) {
      if (!kullanıcı.roles.cache.has(config.badges.vdia)) {
        await kullanıcı.roles.add(config.badges.vdia);
        kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vemerl]);
        eresbosEmbed.addFields({ name: "❯ Yeni Ses Rozeti!", value: `Tebrikler dostum! :tada: Public kanallarda \`${client.getTime(ms(config.targetAmount.vdia))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vdia)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vemerl)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vemerl) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Ses Rozet Durumu:", value: `Tebrikler **${message.guild.roles.cache.get(config.badges.vdia)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vemerl)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vemerl) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.` });
      }
    }
    if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vemerl)) {
      if (!kullanıcı.roles.cache.has(config.badges.vemerl)) {
        await kullanıcı.roles.add(config.badges.vemerl);
        kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vdia]);
        eresbosEmbed.addFields({ name: "❯ Yeni Ses Rozeti!", value: `Tebrikler dostum! :tada: Public kanallarda \`${client.getTime(ms(config.targetAmount.vemerl))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vemerl)}** rozetini kazandın! Göstermiş olduğun emeklerden dolayı seni tebrik ediyorum! :heart:` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Ses Rozet Durumu:", value: `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.vemerl)}** rozetine sahipsin! Sen efsane birisin, emeklerin için çok teşekkürler. :heart:` });
      }
    }
    if (parseInt(messageData ? messageData.topStat : 0) < config.targetAmount.cbronze) {
      if ([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cdia, config.badges.cemerl].some((e) => kullanıcı.roles.cache.get(e))) kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cdia, config.badges.cemerl]).catch(() => { });
      eresbosEmbed.addFields({ name: "❯ Mesaj Rozet Durumu:", value: `Üzgünüm dostum fakat bir rozete sahip değilsin. ${message.guild.roles.cache.get(config.badges.cbronze)} rozetini almak için sohbet kanallarına \`${config.targetAmount.cbronze - (messageData ? messageData.topStat : 0)}\` mesaj atman gerekiyor.` });
    }
    if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cbronze && (messageData ? messageData.topStat : 0) < config.targetAmount.csilver) {
      if (!kullanıcı.roles.cache.has(config.badges.cbronze)) {
        await kullanıcı.roles.add(config.badges.cbronze, "Mesaj Hedef Ödülü | Bronze");
        await kullanıcı.roles.remove([config.badges.csilver, config.badges.cgold, config.badges.cdia, config.badges.cemerl]).catch(() => { });
        eresbosEmbed.addFields({ name: "❯ Yeni Mesaj Rozeti!", value: `Tebrikler dostum! :tada: Sohbet kanallarına \`${parseInt(config.targetAmount.cbronze).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cbronze)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.csilver)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.csilver - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Mesaj Rozet Durumu:", value: `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cbronze)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.csilver)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.csilver - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      }
    }
    if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.csilver && (messageData ? messageData.topStat : 0) < config.targetAmount.cgold) {
      if (!kullanıcı.roles.cache.has(config.badges.csilver)) {
        await kullanıcı.roles.add(config.badges.csilver, "Mesaj Hedef Ödülü | Silver");
        await kullanıcı.roles.remove([config.badges.cbronze, config.badges.cgold, config.badges.cdia, config.badges.cemerl]).catch(() => { });
        eresbosEmbed.addFields({ name: "❯ Yeni Mesaj Rozeti!", value: `Tebrikler dostum! :tada: Sohbet kanallarına \`${parseInt(config.targetAmount.csilver).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.csilver)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.cgold)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cgold - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Mesaj Rozet Durumu:", value: `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.csilver)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.cgold)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cgold - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      }
    }
    if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cgold && (messageData ? messageData.topStat : 0) < config.targetAmount.cdia) {
      if (!kullanıcı.roles.cache.has(config.badges.cgold)) {
        await kullanıcı.roles.add(config.badges.cgold, "Mesaj Hedef Ödülü | Gold");
        await kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cdia, config.badges.cemerl]).catch(() => { });
        eresbosEmbed.addFields({ name: "❯ Yeni Mesaj Rozeti!", value: `Tebrikler dostum! :tada: Sohbet kanallarına \`${parseInt(config.targetAmount.cgold).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cgold)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.cdia)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cdia - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Mesaj Rozet Durumu:", value: `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cgold)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.cdia)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cdia - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      }
    }
    if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cdia && (messageData ? messageData.topStat : 0) < config.targetAmount.cemerl) {
      if (!kullanıcı.roles.cache.has(config.badges.cdia)) {
        await kullanıcı.roles.add(config.badges.cdia, "Mesaj Hedef Ödülü | Diamond");
        await kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cemerl]).catch(() => { });
        eresbosEmbed.addFields({ name: "❯ Yeni Mesaj Rozeti!", value: `Tebrikler dostum! :tada: Sohbet kanallarına \`${parseInt(config.targetAmount.cdia).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cdia)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cemerl - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Mesaj Rozet Durumu:", value: `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cdia)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cemerl - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.` });
      }
    }
    if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cemerl) {
      if (!kullanıcı.roles.cache.has(config.badges.cemerl)) {
        await kullanıcı.roles.add(config.badges.cemerl, "Mesaj Hedef Ödülü | Emerland");
        await kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cdia]).catch(() => { });
        eresbosEmbed.addFields({ name: "❯ Yeni Mesaj Rozeti!", value: `Tebrikler dostum! :tada: Sohbet kanallarına \`${parseInt(config.targetAmount.cemerl).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetini kazandın! Göstermiş olduğun emeklerden dolayı seni tebrik ediyorum! :heart:` });
      } else {
        eresbosEmbed.addFields({ name: "❯ Mesaj Rozet Durumu:", value: `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetine sahipsin! Sen efsane birisin, emeklerin için çok teşekkürler. :heart:` });
      }
    }

    const maxValue = ranksData.ranks[ranksData.ranks.indexOf(ranksData.ranks.find((e) => e.points > (pointData ? pointData.points : 0)))] || ranksData.ranks.last();
    const currentRank = ranksData.ranks.filter((e) => (pointData ? pointData.points : 0) >= e.points).last();

    if (ranksData.pointSystem && kullanıcı.hasRole(config.staffRoles, false) && ranksData.ranks.length > 0) {
      eresbosEmbed.addFields(
        { name: `❯ Puan Durumu: (${pointData ? pointData.points.toLocaleString() : 0} Puan)`, value: `${parseInt((pointData ? pointData.points : 0) / maxValue.points * 100) <= 100 ? `\`%${parseInt((pointData ? pointData.points : 0) / maxValue.points * 100)}\`` : "`%100`"} ${client.progressBar(pointData ? pointData.points : 0, maxValue.points, 6)} \`${pointData ? pointData.points.toLocaleString() : 0} / ${(maxValue.points).toLocaleString()}\`` },
        { name: "❯ Yetki Durumu:", value: currentRank !== ranksData.ranks.last() ? `${currentRank ? `Şu an <@&${currentRank.rank}> yetkisindesiniz.` : ""} <@&${maxValue.rank}> yetkisine ulaşmak için \`${(maxValue.points - (pointData ? pointData.points : 0)).toLocaleString()}\` puan kazanmanız gerekiyor. \n${maxValue.hammers.length > 0 ? `Bir sonraki yetkiye ulaşınca ${maxValue.hammers.map((e) => `<@&${e}>`).join(", ")} ${maxValue.hammers.length === 1 ? "rolünü" : "rollerini"} kazanacaksınız.` : ""}` : "Şu an son yetkidesiniz. Emekleriniz için teşekkür ederiz." },
      );
    }
    message.reply({ embeds: [eresbosEmbed.setDescription(`${kullanıcı.user.toString()} (${kullanıcı.roles.highest}) kullanıcısının yetkili istatistikleri;`).setThumbnail(kullanıcı.user.displayAvatarURL({ dynamic: true }))] }).then(() => message.react(config.emojis.onay));
  }
};
