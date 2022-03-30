const client = global.client;
const config = require("../configs/config.json");
const { leaderBoard, sunucuAdi, topMessage, topVoice } = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const { MessageEmbed } = require("discord.js");
const { CronJob } = require("cron");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

module.exports = () => {
    const eresbosEmbed = new MessageEmbed().setColor(0x55001b);
    const kanal = client.channels.cache.get(leaderBoard);
    if (!kanal) return;
    const messageData = async (type) => {
        let data = await messageUser.find({ guildID: kanal.guild.id }).sort({ topStat: -1 });
        data = data.filter((e) => e[type] !== 0 && kanal.guild.members.cache.has(e.userID));
        return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${Number(e[type]).toLocaleString()} mesaj\``).join("\n") : "`Veri bulunmuyor.`";
    };
    const voiceData = async (type) => {
        let data = await voiceUser.find({ guildID: kanal.guild.id }).sort({ topStat: -1 });
        data = data.filter((e) => e[type] !== 0 && kanal.guild.members.cache.has(e.userID));
        return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${client.getTime(e[type])}\``).join("\n") : "`Veri bulunmuyor.`";
    };
    kanal.messages.fetch(topMessage).then(async (e) => {
        e.edit(eresbosEmbed
            .setDescription(`${await messageData("topStat")}`)
            .setFooter(`Son Güncelleme: ${moment(Date.now()).format("LLL")}`, kanal.guild.iconURL({ dynamic: true }))
            .setAuthor(`${sunucuAdi} Mesaj Sıralaması | Tüm Zamanlar`, kanal.guild.iconURL({ dynamic: true }))
        );
    }).catch((err) => console.log(`LeaderBoard - Message Error: ${err}`));
    kanal.messages.fetch(topVoice).then(async (e) => {
        e.edit(eresbosEmbed
            .setDescription(`${await voiceData("topStat")}`)
            .setFooter(`Son Güncelleme: ${moment(Date.now()).format("LLL")}`, kanal.guild.iconURL({ dynamic: true }))
            .setAuthor(`${sunucuAdi} Ses Sıralaması | Tüm Zamanlar`, kanal.guild.iconURL({ dynamic: true }))
        );
    }).catch((err) => console.log(`LeaderBoard - Voice Error: ${err}`));
    const leaderBoardd = new CronJob("*/30 * * * *", () => {
        kanal.messages.fetch(topMessage).then(async (e) => {
            e.edit(eresbosEmbed
                .setDescription(`${await messageData("topStat")}`)
                .setFooter(`Son Güncelleme: ${moment(Date.now()).format("LLL")}`, kanal.guild.iconURL({ dynamic: true }))
                .setAuthor(`${sunucuAdi} Mesaj Sıralaması | Tüm Zamanlar`, kanal.guild.iconURL({ dynamic: true }))
            );
        }).catch((err) => console.log(`LeaderBoard - Message Error: ${err}`));
        kanal.messages.fetch(topVoice).then(async (e) => {
            e.edit(eresbosEmbed
                .setDescription(`${await voiceData("topStat")}`)
                .setFooter(`Son Güncelleme: ${moment(Date.now()).format("LLL")}`, kanal.guild.iconURL({ dynamic: true }))
                .setAuthor(`${sunucuAdi} Ses Sıralaması | Tüm Zamanlar`, kanal.guild.iconURL({ dynamic: true }))
            );
        }).catch((err) => console.log(`LeaderBoard - Voice Error: ${err}`));
    }, null, true, "Europe/Istanbul");
    leaderBoardd.start();
};

module.exports.conf = {
    name: "ready"
};
