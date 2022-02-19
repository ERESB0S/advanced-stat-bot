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

module.exports = {
    conf: {
        aliases: ["topstats"],
        name: "topstat",
        help: "topstat [1-2-3-4] <@Rol/ID>",
        category: "Genel",
        enabled: true
    },

    /**
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } eresbosEmbed 
     * @param { String } prefix 
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
        let pointSum = 0;

        if (!args[0]) { return message.channel.send(eresbosEmbed.setDescription(`
Lütfen istatistiklerine bakmak istediğiniz kategoriyi belirtin.

\`1.\` Toplam
\`2.\` Ses
\`3.\` Mesaj
\`4.\` Puan

Örnek Kullanım:
\`${prefix}topstat 1\`
\`${prefix}topstat 2 <Rol_ID>\`
`)).then(() => message.react(config.emojis.red));
        } if (args[0] === "1") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (args[1] && !role) return message.reply("Üzgünüm dostum fakat belirttiğin rolü bulamıyorum. Lütfen geçerli bir rol veya rol id'si belirt.").then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
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
                message.channel.send(eresbosEmbed.setDescription(`
${role.toString()} rolüne sahip üyelerin **toplam** istatistik verileri

**❯ Ses Bilgileri:**
${await voiceData("topStat")}

**❯ Mesaj Bilgileri:**
${await messageData("topStat")}

**❯ Puan Bilgileri:**
${await pointData()}
`));
            } else {
                const messageChannels = messageChannelData.splice(0, 10).map((e, i) => `\`${i+1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${Number(e.channelData).toLocaleString()} mesaj\``).join("\n");
                const voiceChannels = voiceChannelData.splice(0, 10).map((e, i) => `\`${i+1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${client.getTime(e.channelData)}\``).join("\n");
                const messageUsers = messageUsersData.splice(0, 10).map((e, i) => `\`${i+1}.\` <@${e.userID}>: \`${Number(e.topStat).toLocaleString()} mesaj\``).join("\n");
                const voiceUsers = voiceUsersData.splice(0, 10).map((e, i) => `\`${i+1}.\` <@${e.userID}>: \`${client.getTime(e.topStat)}\``).join("\n");
                const pointUsers = pointData.splice(0, 10).map((e, i) => {
                    pointSum += e.points;
                    return `\`${i+1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``;
                }).join("\n");

                message.channel.send(eresbosEmbed.setDescription(`
${message.guild.name} adlı sunucunun **toplam** istatistik verileri;
    
**❯ Ses Bilgileri: (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("M [ay], d [gün], H [saat] m [dk], s [sn].")}\`)**
${voiceUsers.length > 0 ? voiceUsers : "`Veri Bulunmuyor.`"}
    
**❯ Ses Kanal Bilgileri:**
${voiceChannels.length > 0 ? voiceChannels : "`Veri Bulunmuyor.`"}
    
**❯ Mesaj Bilgileri: (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)**
${messageUsers.length > 0 ? messageUsers : "`Veri Bulunmuyor.`"}
    
**❯ Mesaj Kanal Bilgileri:**
${messageChannels.length > 0 ? messageChannels : "`Veri Bulunmuyor.`"}
    
**❯ Puan Bilgileri: (\`Toplam ${pointSum.toLocaleString()}\`)**
${pointUsers.length > 0 ? pointUsers : "`Veri Bulunmuyor.`"}    
`)).then(() => message.react(config.emojis.onay));
            }
        } else if (args[0] === "2") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (args[1] && !role) return message.reply("Üzgünüm dostum fakat belirttiğin rolü bulamıyorum. Lütfen geçerli bir rol veya rol id'si belirt.").then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            if (role) {
                const voiceData = async (type) => {
                    let data = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
                    data = data.filter((e) => e[type] !== 0 && message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
                    return data.length > 0 ? data.splice(0, 15).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${client.getTime(e[type])}\``).join("\n") : "`Veri bulunmuyor.`";
                };
                message.channel.send(eresbosEmbed.setDescription(`
${role.toString()} rolüne sahip üyelerin **toplam ses** istatistik verileri

**❯ Toplam Ses Bilgileri:**
${await voiceData("topStat")}

**❯ 2 Haftalık Mesaj Bilgileri:**
${await voiceData("twoWeeklyStat")}

**❯ Haftalık Ses Bilgileri:**
${await voiceData("weeklyStat")}

**❯ Günlük Ses Bilgileri:**
${await voiceData("dailyStat")}
`)).then(() => message.react(config.emojis.onay));
            } else {
                const voiceChannels = voiceChannelData.splice(0, 20).map((e, i) => `\`${i+1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${client.getTime(e.channelData)}\``).join("\n");
                const voiceUsers = voiceUsersData.splice(0, 20).map((e, i) => `\`${i+1}.\` <@${e.userID}>: \`${client.getTime(e.topStat)}\``).join("\n");

                message.channel.send(eresbosEmbed.setDescription(`
${message.guild.name} adlı sunucunun **toplam ses** istatistik verileri;

**❯ Ses Bilgileri: (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("M [ay], d [gün], H [saat] m [dk], s [sn].")}\`)**
${voiceUsers.length > 0 ? voiceUsers : "`Veri Bulunmuyor.`"}

**❯ Ses Kanal Bilgileri:**
${voiceChannels.length > 0 ? voiceChannels : "`Veri Bulunmuyor.`"}
`)).then(() => message.react(config.emojis.onay));
            }
        } else if (args[0] === "3") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (args[1] && !role) return message.reply("Üzgünüm dostum fakat belirttiğin rolü bulamıyorum. Lütfen geçerli bir rol veya rol id'si belirt.").then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            if (role) {
                const messageData = async (type) => {
                    let data = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
                    data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
                    return data.length > 0 ? data.splice(0, 15).map((e, i) => `\`${i + 1}.\` <@${e.userID}> : \`${Number(e[type]).toLocaleString()} mesaj\``).join("\n") : "`Veri bulunmuyor.`";
                };
                message.channel.send(eresbosEmbed.setDescription(`
${role.toString()} rolüne sahip üyelerin **toplam mesaj** istatistik verileri

**❯ Toplam Mesaj Bilgileri:**
${await messageData("topStat")}

**❯ 2 Haftalık Mesaj Bilgileri:**
${await messageData("twoWeeklyStat")}

**❯ Haftalık Mesaj Bilgileri:**
${await messageData("weeklyStat")}

**❯ Günlük Mesaj Bilgileri:**
${await messageData("dailyStat")}
`)).then(() => message.react(config.emojis.onay));
            } else {
                const messageChannels = messageChannelData.splice(0, 20).map((e, i) => `\`${i+1}.\` ${message.guild.channels.cache.get(e.channelID) ? `<#${e.channelID}>` : "Kanal Silinmiş"}: \`${Number(e.channelData).toLocaleString()} mesaj\``).join("\n");
                const messageUsers = messageUsersData.splice(0, 20).map((e, i) => `\`${i+1}.\` <@${e.userID}>: \`${Number(e.topStat).toLocaleString()} mesaj\``).join("\n");
    
                message.channel.send(eresbosEmbed.setDescription(`
${message.guild.name} adlı sunucunun **toplam mesaj** istatistik verileri;
    
**❯ Mesaj Bilgileri: (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)**
${messageUsers.length > 0 ? messageUsers : "`Veri Bulunmuyor.`"}
    
**❯ Mesaj Kanal Bilgileri:**
${messageChannels.length > 0 ? messageChannels : "`Veri Bulunmuyor.`"}
`)).then(() => message.react(config.emojis.onay));
            }
        } else if (args[0] === "4") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (args[1] && !role) return message.reply("Üzgünüm dostum fakat belirttiğin rolü bulamıyorum. Lütfen geçerli bir rol veya rol id'si belirt.").then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            if (role) {
                const pointData = async () => {
                    let data = await points.find({ guildID: message.guild.id }).sort({ points: -1 });
                    data = data.filter(e => message.guild.members.cache.has(e.userID) && message.guild.members.cache.get(e.userID).roles.cache.has(role.id));
                    return data.length > 0 ? data.splice(0, 20).map((e, i) => `\`${i + 1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``).join("\n") : "`Veri bulunmuyor.`";
                };
                message.channel.send(eresbosEmbed.setDescription(`
${role.toString()} rolüne sahip üyelerin **toplam puan** istatistik verileri

**❯ Toplam Puan Bilgileri:**
${await pointData()}
`)).then(() => message.react(config.emojis.onay));
            } else {
                const pointUsers = pointData.splice(0, 20).map((e, i) => {
                    pointSum += e.points;
                    return `\`${i+1}.\` <@${e.userID}>: \`${Number(e.points).toLocaleString()} puan\``;
                }).join("\n");
    
                message.channel.send(eresbosEmbed.setDescription(`
${message.guild.name} adlı sunucunun **toplam puan** istatistik verileri;
    
**❯ Puan Bilgileri: (\`Toplam ${pointSum.toLocaleString()}\`)**
${pointUsers.length > 0 ? pointUsers : "`Veri Bulunmuyor.`"}
`)).then(() => message.react(config.emojis.onay));
            }
        }
    }
};
