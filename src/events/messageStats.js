const client = global.client;
const { MessageEmbed } = require("discord.js");
const config = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const messageGuild = require("../schemas/messageGuild");
const guildChannel = require("../schemas/messageGuildChannel");
const messageUserChannel = require("../schemas/messageUserChannel");
const points = require("../schemas/points");
const nums = new Map();

/**
 * @param { Message } message 
 * @returns 
 */
module.exports = async (message) => {
    if (
        config.otherRoles.cmuted.some((e) => message.member.roles.cache.has(e)) && 
        config.otherRoles.vmuted.some((e) => message.member.roles.cache.has(e)) && 
        config.otherRoles.jailed.some((e) => message.member.roles.cache.has(e)) && 
        config.otherRoles.fTag.some((e) => message.member.roles.cache.get(e)) && 
        config.otherRoles.susp.some((e) => message.member.roles.cache.has(e)) && 
        config.otherRoles.underWorld.some((e) => message.member.roles.cache.has(e)) && 
        config.otherRoles.unreg.some((e) => message.member.roles.cache.has(e))
        ) return;
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: message.author.id });
    const logKanal = message.guild.channels.cache.get(config.badges.prizeLog);

    if (message.guild.roles.cache.get(config.badges.cbronze) && config.staffRoles.some((e) => message.member.roles.cache.get(e)) && messageData && logKanal && !message.member.roles.cache.get(config.badges.cbronze) && ((messageData ? messageData.topStat : 0) > config.targetAmount.cbronze) && ((messageData ? messageData.topStat : 0) < config.targetAmount.csilver)) {
        logKanal.send(`${message.member.toString()}, \`${parseInt(config.targetAmount.cbronze).toLocaleString()} adet mesaj\` hedefine ulaştığı için \`${message.guild.roles.cache.get(config.badges.cbronze).name}\` rolünü kazandı!`);
        await message.member.roles.add(config.badges.cbronze, `Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cbronze).name}`);
    } else if (message.guild.roles.cache.get(config.badges.csilver) && config.staffRoles.some((e) => message.member.roles.cache.get(e)) && messageData && logKanal && !message.member.roles.cache.get(config.badges.csilver) && ((messageData ? messageData.topStat : 0) > config.targetAmount.csilver) && ((messageData ? messageData.topStat : 0) < config.targetAmount.cgold)) {
        logKanal.send(`${message.member.toString()}, \`${parseInt(config.targetAmount.csilver).toLocaleString()} adet mesaj\` hedefine ulaştığı için \`${message.guild.roles.cache.get(config.badges.csilver).name}\` rolünü kazandı!`);
        await message.member.roles.add(config.badges.csilver, `Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.csilver).name}`);
        await message.member.roles.remove(config.badges.cbronze, `Eski Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cbronze).name}`);
    } else if (message.guild.roles.cache.get(config.badges.cgold) && config.staffRoles.some((e) => message.member.roles.cache.get(e)) && messageData && logKanal && !message.member.roles.cache.get(config.badges.cgold) && ((messageData ? messageData.topStat : 0) > config.targetAmount.cgold) && ((messageData ? messageData.topStat : 0) < config.targetAmount.cdia)) {
        logKanal.send(`${message.member.toString()}, \`${parseInt(config.targetAmount.cgold).toLocaleString()} adet mesaj\` hedefine ulaştığı için \`${message.guild.roles.cache.get(config.badges.cgold).name}\` rolünü kazandı!`);
        await message.member.roles.add(config.badges.cgold, `Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cgold).name}`);
        await message.member.roles.remove(config.badges.csilver, `Eski Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.csilver).name}`);
    } else if (message.guild.roles.cache.get(config.badges.cdia) && config.staffRoles.some((e) => message.member.roles.cache.get(e)) && messageData && logKanal && !message.member.roles.cache.get(config.badges.cdia) && ((messageData ? messageData.topStat : 0) > config.targetAmount.cdia) && ((messageData ? messageData.topStat : 0) < config.targetAmount.cemerl)) {
        logKanal.send(`${message.member.toString()}, \`${parseInt(config.targetAmount.cdia).toLocaleString()} adet mesaj\` hedefine ulaştığı için \`${message.guild.roles.cache.get(config.badges.cdia).name}\` rolünü kazandı!`);
        await message.member.roles.add(config.badges.cdia, `Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cdia).name}`);
        await message.member.roles.remove(config.badges.cgold, `Eski Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cgold).name}`);
    } else if (message.guild.roles.cache.get(config.badges.cemerl) && config.staffRoles.some((e) => message.member.roles.cache.get(e)) && messageData && logKanal && !message.member.roles.cache.get(config.badges.cemerl) && ((messageData ? messageData.topStat : 0) > config.targetAmount.cemerl)) {
        logKanal.send(`${message.member.toString()}, \`${parseInt(config.targetAmount.cemerl).toLocaleString()} adet mesaj\` hedefine ulaştığı için \`${message.guild.roles.cache.get(config.badges.cemerl).name}\` rolünü kazandı!`);
        await message.member.roles.add(config.badges.cemerl, `Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cemerl).name}`);
        await message.member.roles.remove(config.badges.cdia, `Eski Mesaj Hedef Ödülü | ${message.guild.roles.cache.get(config.badges.cdia).name}`);
    }

    const prefix = config.prefix.find((e) => message.content.toLowerCase().startsWith(e));
    if (message.author.bot || !message.guild || prefix) return;

    if (config.staffRoles.some((e) => message.member.roles.cache.has(e))) {
        const num = nums.get(message.author.id);
        if (num && (num % config.points.messageCount) === 0) {
            nums.set(message.author.id, num + 1);
            await points.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { points: Number(config.points.messagePoint) } }, { upsert: true });
            const pointData = await points.findOne({ guildID: message.guild.id, userID: message.author.id });
            if (pointData && client.ranks.some(e => pointData.points === e.points)) {
                let newRank = client.ranks.filter(e => pointData.points >= e.points);
                newRank = newRank[newRank.length-1];
                const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
                await message.member.roles.add(newRank.rankRole);
                if (oldRank && Array.isArray(oldRank.rankRole) && oldRank.rankRole.some(e => message.member.roles.cache.has(e)) || oldRank && !Array.isArray(oldRank.rankRole) && message.member.roles.cache.has(oldRank.rankRole)) await message.member.roles.remove(oldRank.rankRole);
                const embed = new MessageEmbed().setColor(message.member.displayHexColor);
                message.guild.channels.cache.get(config.rankLog).send(embed.setDescription(`${message.member.toString()} kullanıcısı \`${pointData.points}\` puan hedefini tamamladı ve ${Array.isArray(newRank.rankRole) ? newRank.rankRole.map(e => `<@&${e}>`).join(", ") : `<@&${newRank.rankRole}>`} rolü verildi!`));
                message.member.roles.add(newRank.hammers);
            }
        } else nums.set(message.author.id, num ? num + 1 : 1);
    }

    await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { timeout: Date.now() }, $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
    await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
    await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
    await messageUserChannel.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
};

module.exports.conf = {
    name: "message"
};
