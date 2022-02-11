const config = require("../configs/config.json");
const ms = require("ms");
const voiceUserParent = require("../schemas/voiceUserParent");
const messageUser = require("../schemas/messageUser");
const points = require("../schemas/points");

module.exports = {
    conf: {
        aliases: ["yme", "ystats"],
        name: "ystat",
        help: "ystat <@Eresbos/ID>",
        category: "Yetkili",
        enabled: true
    },

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } eresbosEmbed 
     * @returns
     */
    run: async (client, message, args, eresbosEmbed) => {
        if (!message.member.permissions.has(8) && !config.staffRoles.some((e) => message.member.roles.cache.has(e))) return;
        const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!kullanıcı.permissions.has(8) && !config.staffRoles.some((e) => kullanıcı.roles.cache.has(e))) return message.reply("Belirttiğin kullanıcı yetkili değil.").then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));

        const pointData = await points.findOne({ guildID: message.guild.id, userID: kullanıcı.id });
        const pubVeriler = await voiceUserParent.findOne({ guildID: message.guild.id, userID: kullanıcı.id, parentID: config.publicParents });
        const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: kullanıcı.id });

        if (parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vbronze)) {
            if ([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vdia, config.badges.vemerl].some((e) => kullanıcı.roles.cache.get(e))) kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vdia, config.badges.vemerl]).catch(() => {});
            eresbosEmbed.addField("❯ Ses Rozet Durumu:", `Üzgünüm dostum fakat bir rozete sahip değilsin. ${message.guild.roles.cache.get(config.badges.vbronze)} rozetini almak için public kanallarda \`${client.getTime(ms(config.targetAmount.vbronze) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
        }
        if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vbronze) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vsilver)) {
            if (!kullanıcı.roles.cache.has(config.badges.vbronze)) {
                await kullanıcı.roles.add(config.badges.vbronze);
                kullanıcı.roles.remove([config.badges.vsilver, config.badges.vgold, config.badges.vdia, config.badges.vemerl]);
                eresbosEmbed.addField("❯ Yeni Ses Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Public kanallarda \`${client.getTime(ms(config.targetAmount.vbronze))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vbronze)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vsilver)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vsilver) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Ses Rozet Durumu:", `Tebrikler **${message.guild.roles.cache.get(config.badges.vbronze)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vsilver)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vsilver) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            }
        }
        if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vsilver) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vgold)) {
            if (!kullanıcı.roles.cache.has(config.badges.vsilver)) {
                await kullanıcı.roles.add(config.badges.vsilver);
                kullanıcı.roles.remove([config.badges.vbronze, config.badges.vgold, config.badges.vdia, config.badges.vemerl]);
                eresbosEmbed.addField("❯ Yeni Ses Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Public kanallarda \`${client.getTime(ms(config.targetAmount.vsilver))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vsilver)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vgold)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vgold) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Ses Rozet Durumu:", `Tebrikler **${message.guild.roles.cache.get(config.badges.vsilver)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vgold)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vgold) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            }
        }
        if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vgold) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vdia)) {
            if (!kullanıcı.roles.cache.has(config.badges.vgold)) {
                await kullanıcı.roles.add(config.badges.vgold);
                kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vdia, config.badges.vemerl]);
                eresbosEmbed.addField("❯ Yeni Ses Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Public kanallarda \`${client.getTime(ms(config.targetAmount.vgold))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vgold)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vdia)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vdia) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Ses Rozet Durumu:", `Tebrikler **${message.guild.roles.cache.get(config.badges.vgold)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vdia)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vdia) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            }
        }
        if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vdia) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vemerl)) {
            if (!kullanıcı.roles.cache.has(config.badges.vdia)) {
                await kullanıcı.roles.add(config.badges.vdia);
                kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vemerl]);
                eresbosEmbed.addField("❯ Yeni Ses Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Public kanallarda \`${client.getTime(ms(config.targetAmount.vdia))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vdia)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.vemerl)}** rozetini elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vemerl) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Ses Rozet Durumu:", `Tebrikler **${message.guild.roles.cache.get(config.badges.vdia)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.vemerl)}** rozeti elde etmek için public kanallarda \`${client.getTime(ms(config.targetAmount.vemerl) - (pubVeriler ? pubVeriler.parentData : 0))}\` geçirmen gerekiyor.`);
            }
        }
        if (parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vemerl)) {
            if (!kullanıcı.roles.cache.has(config.badges.vemerl)) {
                await kullanıcı.roles.add(config.badges.vemerl);
                kullanıcı.roles.remove([config.badges.vbronze, config.badges.vsilver, config.badges.vgold, config.badges.vdia]);
                eresbosEmbed.addField("❯ Yeni Ses Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Public kanallarda \`${client.getTime(ms(config.targetAmount.vemerl))}\` geçirerek **${message.guild.roles.cache.get(config.badges.vemerl)}** rozetini kazandın! Göstermiş olduğun emeklerden dolayı seni tebrik ediyorum! <a:eresbos_kalp:895739415761133590>`);
            } else {
                eresbosEmbed.addField("❯ Ses Rozet Durumu:", `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.vemerl)}** rozetine sahipsin! Sen efsane birisin, emeklerin için çok teşekkürler. <a:eresbos_kalp:895739415761133590>`);
            }
        }
        if (parseInt(messageData ? messageData.topStat : 0) < config.targetAmount.cbronze) {
            if ([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cdia, config.badges.cemerl].some((e) => kullanıcı.roles.cache.get(e))) kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cdia, config.badges.cemerl]).catch(() => {});
            eresbosEmbed.addField("❯ Mesaj Rozet Durumu:", `Üzgünüm dostum fakat bir rozete sahip değilsin. ${message.guild.roles.cache.get(config.badges.cbronze)} rozetini almak için sohbet kanallarına \`${config.targetAmount.cbronze - (messageData ? messageData.topStat : 0)}\` mesaj atman gerekiyor.`);
        }
        if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cbronze && (messageData ? messageData.topStat : 0) < config.targetAmount.csilver) {
            if (!kullanıcı.roles.cache.has(config.badges.cbronze)) {
                await kullanıcı.roles.add(config.badges.cbronze, "Mesaj Hedef Ödülü | Bronze");
                await kullanıcı.roles.remove([config.badges.csilver, config.badges.cgold, config.badges.cdia, config.badges.cemerl]).catch(() => {});
                eresbosEmbed.addField("❯ Yeni Mesaj Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Sohbet kanallarına \`${parseInt(config.targetAmount.cbronze).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cbronze)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.csilver)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.csilver - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Mesaj Rozet Durumu:", `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cbronze)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.csilver)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.csilver - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            }
        }
        if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.csilver && (messageData ? messageData.topStat : 0) < config.targetAmount.cgold) {
            if (!kullanıcı.roles.cache.has(config.badges.csilver)) {
                await kullanıcı.roles.add(config.badges.csilver, "Mesaj Hedef Ödülü | Silver");
                await kullanıcı.roles.remove([config.badges.cbronze, config.badges.cgold, config.badges.cdia, config.badges.cemerl]).catch(() => {});
                eresbosEmbed.addField("❯ Yeni Mesaj Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Sohbet kanallarına \`${parseInt(config.targetAmount.csilver).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.csilver)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.cgold)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cgold - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Mesaj Rozet Durumu:", `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.csilver)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.cgold)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cgold - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            }
        }
        if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cgold && (messageData ? messageData.topStat : 0) < config.targetAmount.cdia) {
            if (!kullanıcı.roles.cache.has(config.badges.cgold)) {
                await kullanıcı.roles.add(config.badges.cgold, "Mesaj Hedef Ödülü | Gold");
                await kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cdia, config.badges.cemerl]).catch(() => {});
                eresbosEmbed.addField("❯ Yeni Mesaj Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Sohbet kanallarına \`${parseInt(config.targetAmount.cgold).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cgold)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.cdia)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cdia - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Mesaj Rozet Durumu:", `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cgold)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.cdia)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cdia - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            }
        }
        if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cdia && (messageData ? messageData.topStat : 0) < config.targetAmount.cemerl) {
            if (!kullanıcı.roles.cache.has(config.badges.cdia)) {
                await kullanıcı.roles.add(config.badges.cdia, "Mesaj Hedef Ödülü | Diamond");
                await kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cemerl]).catch(() => {});
                eresbosEmbed.addField("❯ Yeni Mesaj Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Sohbet kanallarına \`${parseInt(config.targetAmount.cdia).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cdia)}** rozetini kazandın! Bir sonraki **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cemerl - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            } else {
                eresbosEmbed.addField("❯ Mesaj Rozet Durumu:", `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cdia)}** rozetine sahipsin! Bir sonraki **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetini elde etmek için sohbet kanallarına \`${(config.targetAmount.cemerl - (messageData ? messageData.topStat : 0)).toLocaleString()}\` mesaj atman gerekiyor.`);
            }
        }
        if (parseInt(messageData ? messageData.topStat : 0) > config.targetAmount.cemerl) {
            if (!kullanıcı.roles.cache.has(config.badges.cemerl)) {
                await kullanıcı.roles.add(config.badges.cemerl, "Mesaj Hedef Ödülü | Emerland");
                await kullanıcı.roles.remove([config.badges.cbronze, config.badges.csilver, config.badges.cgold, config.badges.cdia]).catch(() => {});
                eresbosEmbed.addField("❯ Yeni Mesaj Rozeti!", `Tebrikler dostum! <a:eresbos_surpriz:907973919795998720> Sohbet kanallarına \`${parseInt(config.targetAmount.cemerl).toLocaleString()} mesaj\` atarak **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetini kazandın! Göstermiş olduğun emeklerden dolayı seni tebrik ediyorum! <a:eresbos_kalp:895739415761133590>`);
            } else {
                eresbosEmbed.addField("❯ Mesaj Rozet Durumu:", `Tebrikler dostum **${message.guild.roles.cache.get(config.badges.cemerl)}** rozetine sahipsin! Sen efsane birisin, emeklerin için çok teşekkürler. <a:eresbos_kalp:895739415761133590>`);
            }
        }
        const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(e => e.points >= (pointData ? pointData.points : 0)))] || client.ranks[client.ranks.length-1];
        let currentRank = client.ranks.filter((e) => (pointData ? pointData.points : 0) >= e.points);
        currentRank = currentRank[currentRank.length-1];
        const pointStatus = config.staffRoles.some((e) => kullanıcı.roles.cache.has(e)) && client.ranks.length > 0 ? `${parseInt((pointData ? pointData.points : 0) / maxValue.points * 100) <= 100 ? `\`%${parseInt((pointData ? pointData.points : 0) / maxValue.points * 100)}\`` : "`%100`"} ${client.progressBar(pointData ? pointData.points : 0, maxValue.points, 8)} \`${pointData ? pointData.points.toLocaleString() : 0} / ${maxValue.points.toLocaleString()}\`` : 0;
        const rankStatus = config.staffRoles.some((e) => kullanıcı.roles.cache.has(e)) && client.ranks.length > 0 ? `${currentRank ? `${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.rankRole) ? currentRank.rankRole.map(e => `<@&${e}>`).join(", ") : `<@&${currentRank.rankRole}>`} rolündesiniz. ${Array.isArray(maxValue.rankRole) ? maxValue.rankRole.length > 1 ? maxValue.rankRole.slice(0, -1).map(e => `<@&${e}>`).join(", ") + " ve " + maxValue.rankRole.map(e => `<@&${e}>`).slice(-1) : maxValue.rankRole.map(e => `<@&${e}>`).join("") : `<@&${maxValue.rankRole}>`} (${Array.isArray(maxValue.hammers) ? maxValue.hammers.length > 1 ? maxValue.hammers.slice(0, -1).map(e => `<@&${e}>`).join(", ") + " ve " + maxValue.hammers.map(e => `<@&${e}>`).slice(-1) : maxValue.hammers.map(e => `<@&${e}>`).join("") : `<@&${maxValue.hammers}>`}) rolüne ulaşmak için \`${(maxValue.points-pointData.points).toLocaleString()}\` puan kazanmanız gerekiyor!` : "Şu an son yetkidesin! Emeklerin için çok teşekkürler. <a:eresbos_kalp:895739415761133590>"}` : `${Array.isArray(maxValue.rankRole) ? maxValue.rankRole.length > 1 ? maxValue.rankRole.slice(0, -1).map(e => `<@&${e}>`).join(", ") + " ve " + maxValue.rankRole.map(e => `<@&${e}>`).slice(-1) : maxValue.rankRole.map(e => `<@&${e}>`).join("") : `<@&${maxValue.rankRole}>`} (${Array.isArray(maxValue.hammers) ? maxValue.hammers.length > 1 ? maxValue.hammers.slice(0, -1).map(e => `<@&${e}>`).join(", ") + " ve " + maxValue.hammers.map(e => `<@&${e}>`).slice(-1) : maxValue.hammers.map(e => `<@&${e}>`).join("") : `<@&${maxValue.hammers}>`}) rolüne ulaşmak için \`${(maxValue.points - (pointData ? pointData.points : 0)).toLocaleString()}\` puan kazanmanız gerekiyor!`}` : "";

        eresbosEmbed.setThumbnail(kullanıcı.user.avatarURL({ dynamic: true }));
        eresbosEmbed.setDescription(`${kullanıcı.user.toString()} (${kullanıcı.roles.highest}) kullanıcısının yetkili istatistikleri;`);
        if (pointStatus) eresbosEmbed.addField(`❯ Puan Durumu: (${pointData ? pointData.points.toLocaleString() : 0} Puan)`, pointStatus);
        if (rankStatus) eresbosEmbed.addField("❯ Yetki Durumu:", rankStatus);
        message.channel.send(eresbosEmbed).then(() => message.react(config.emojis.onay));
    }
};
