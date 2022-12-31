const client = global.client;
const { EmbedBuilder } = require("discord.js");
const config = require("../configs/config.json");
const joinedAt = require("../schemas/voiceJoinedAt");
const voiceUser = require("../schemas/voiceUser");
const voiceGuild = require("../schemas/voiceGuild");
const guildChannel = require("../schemas/voiceGuildChannel");
const userChannel = require("../schemas/voiceUserChannel");
const userParent = require("../schemas/voiceUserParent");
const points = require("../schemas/points");
const ranks = require("../schemas/ranks");
const ms = require("ms");

/**
 * @param { import("discord.js").VoiceState } oldState 
 * @param { import("discord.js").VoiceState } newState 
 * @returns 
 */
module.exports = async (oldState, newState) => {
  if (oldState.guild.id !== config.guildID) return;
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  if (
    config.otherRoles.cmuted.some((e) => oldState.member.roles.cache.get(e)) &&
    config.otherRoles.vmuted.some((e) => oldState.member.roles.cache.get(e)) &&
    config.otherRoles.jailed.some((e) => oldState.member.roles.cache.get(e)) &&
    config.otherRoles.fTag.some((e) => oldState.member.roles.cache.get(e)) &&
    config.otherRoles.susp.some((e) => oldState.member.roles.cache.get(e)) &&
    config.otherRoles.underWorld.some((e) => oldState.member.roles.cache.has(e)) &&
    config.otherRoles.unreg.some((e) => oldState.member.roles.cache.get(e))
  ) return;
  const logKanal = oldState.guild.channels.cache.get(config.badges.prizeLog);
  const pubVeriler = await userParent.findOne({ guildID: oldState.guild.id, userID: oldState.id, parentID: config.publicParents });

  if (oldState.guild.roles.cache.get(config.badges.vbronze) && config.staffRoles.some((e) => oldState.member.roles.cache.get(e)) && !oldState.member.roles.cache.get(config.badges.vbronze) && parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vbronze) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vsilver)) {
    if (logKanal) logKanal.send(`${oldState.member.toString()}, \`${client.getTime(ms(config.targetAmount.vbronze))} ses\` hedefine ulaştığı için \`${oldState.guild.roles.cache.get(config.badges.vbronze).name}\` rolünü kazandı!`);
    await oldState.member.roles.add(config.badges.vbronze, `Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vbronze).name}`);
  } else if (oldState.guild.roles.cache.get(config.badges.vsilver) && config.staffRoles.some((e) => oldState.member.roles.cache.get(e)) && !oldState.member.roles.cache.get(config.badges.vsilver) && parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vsilver) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vgold)) {
    if (logKanal) logKanal.send(`${oldState.member.toString()}, \`${client.getTime(ms(config.targetAmount.vsilver))} ses\` hedefine ulaştığı için \`${oldState.guild.roles.cache.get(config.badges.vsilver).name}\` rolünü kazandı!`);
    await oldState.member.roles.add(config.badges.vsilver, `Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vsilver).name}`);
    await oldState.member.roles.remove(config.badges.vbronze, `Eski Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vbronze).name}`);
  } else if (oldState.guild.roles.cache.get(config.badges.vgold) && config.staffRoles.some((e) => oldState.member.roles.cache.get(e)) && !oldState.member.roles.cache.get(config.badges.vgold) && parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vgold) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vdia)) {
    if (logKanal) logKanal.send(`${oldState.member.toString()}, \`${client.getTime(ms(config.targetAmount.vgold))} ses\` hedefine ulaştığı için \`${oldState.guild.roles.cache.get(config.badges.vgold).name}\` rolünü kazandı!`);
    await oldState.member.roles.add(config.badges.vgold, `Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vgold).name}`);
    await oldState.member.roles.remove(config.badges.vsilver, `Eski Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vsilver).name}`);
  } else if (oldState.guild.roles.cache.get(config.badges.vdia) && config.staffRoles.some((e) => oldState.member.roles.cache.get(e)) && !oldState.member.roles.cache.get(config.badges.vdia) && parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vdia) && parseInt(pubVeriler ? pubVeriler.parentData : 0) < ms(config.targetAmount.vemerl)) {
    if (logKanal) logKanal.send(`${oldState.member.toString()}, \`${client.getTime(ms(config.targetAmount.vdia))} ses\` hedefine ulaştığı için \`${oldState.guild.roles.cache.get(config.badges.vdia).name}\` rolünü kazandı!`);
    await oldState.member.roles.add(config.badges.vdia, `Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vdia).name}`);
    await oldState.member.roles.remove(config.badges.vgold, `Eski Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vgold).name}`);
  } else if (oldState.guild.roles.cache.get(config.badges.vemerl) && config.staffRoles.some((e) => oldState.member.roles.cache.get(e)) && !oldState.member.roles.cache.get(config.badges.vemerl) && parseInt(pubVeriler ? pubVeriler.parentData : 0) > ms(config.targetAmount.vemerl)) {
    if (logKanal) logKanal.send(`${oldState.member.toString()}, \`${client.getTime(ms(config.targetAmount.vemerl))} ses\` hedefine ulaştığı için \`${oldState.guild.roles.cache.get(config.badges.vemerl).name}\` rolünü kazandı!`);
    await oldState.member.roles.add(config.badges.vemerl, `Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vemerl).name}`);
    await oldState.member.roles.remove(config.badges.vdia, `Eski Ses Hedef Ödülü | ${oldState.guild.roles.cache.get(config.badges.vdia).name}`);
  }

  if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ guildID: newState.guild.id, userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
  let joinedAtData = await joinedAt.findOne({ guildID: oldState.guild.id, userID: oldState.id });
  if (!joinedAtData) await joinedAt.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ guildID: oldState.guild.id, userID: oldState.id });
  const data = Date.now() - joinedAtData.date;

  if (oldState.channelId && !newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ guildID: oldState.guild.id, userID: oldState.id });
  } else if (oldState.channelId && newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ guildID: oldState.guild.id, userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }
};

async function saveData(user, channel, data) {
  const ranksData = await ranks.findOne({ guildId: user.guild.id });
  if (ranksData.pointSystem === true && config.staffRoles.some((e) => user.member.roles.cache.has(e))) {
    if (channel.parent && config.publicParents.includes(channel.parentId) && !channel.id !== config.sleepRoom) {
      if (data >= (1000 * 60) * config.points.publicCount) await points.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { points: Math.floor(parseInt(data / 1000 / 60) / config.points.publicCount) * config.points.publicPoint } }, { upsert: true });
    } else if (data >= (1000 * 60) * config.points.voiceCount) await points.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { points: Math.floor(parseInt(data / 1000 / 60) / config.points.voiceCount) * config.points.voicePoint } }, { upsert: true });
    const pointData = await points.findOne({ guildID: user.guild.id, userID: user.id });
    if (pointData && ranksData.ranks.some((e) => pointData.points >= e.points && !user.member.hasRole(e.rank))) {
      const newRank = ranksData.ranks.filter((e) => pointData.points >= e.points).last();
      if (newRank && !user.member.roles.cache.has(newRank.rank)) {
        await user.member.roles.add(newRank.rank);
        await user.member.roles.add(newRank.hammers);
        const oldRoles = ranksData.ranks[ranksData.ranks.indexOf(newRank) - 1];
        if (oldRoles) await user.member.roles.remove(oldRoles.rank);
        const embed = new EmbedBuilder().setColor(user.member.displayHexColor);
        const log = user.guild.channels.cache.get(config.rankLog);
        if (log) log.send({ embeds: [embed.setDescription(`${user.member.toString()} kullanıcısı \`${Number(newRank.points).toLocaleString()}\` puan hedefini tamamladı ve <@&${newRank.rank}> ${newRank.hammers.length > 0 ? `(${newRank.hammers.map((e) => `<@&${e}>`).join(", ")})` : ""} rolü verildi!`)] });
      }
    }
  }

  await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data } }, { upsert: true });
  await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  if (channel.id !== config.sleepRoom && channel.parent) await userParent.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, parentID: channel.parentId }, { $inc: { parentData: data } }, { upsert: true });
}

module.exports.conf = {
  name: "voiceStateUpdate",
};
