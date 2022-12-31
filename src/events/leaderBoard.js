const client = global.client;
const config = require("../configs/config.json");
const { leaderBoard, sunucuAdi, topMessage, topVoice } = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const { EmbedBuilder } = require("discord.js");
const { CronJob } = require("cron");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

module.exports = async () => {
  const channel = client.channels.cache.get(leaderBoard);
  if (!channel) return console.log("[LEADERBOARD] Lider tablosu kanalı bulunamadı!");
  const textMessageData = await channel.messages.fetch(topMessage);
  if (!textMessageData) return console.log("[LEADERBOARD] Mesaj sıralaması lider tablosu mesajı bulunamadı!");
  const voiceMessageData = await channel.messages.fetch(topVoice);
  if (!voiceMessageData) return console.log("[LEADERBOARD] Ses sıralaması lider tablosu mesajı bulunamadı!");
  client.fetchLeaderBoard(channel, textMessageData, voiceMessageData);
  const leaderboard = new CronJob("*/30 * * * *", async () => client.fetchLeaderBoard(channel, textMessageData, voiceMessageData));
  leaderboard.start();
};

module.exports.conf = {
  name: "ready",
};
