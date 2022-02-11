const client = global.client;
const config = require("../configs/config.json");
const messageUser = require("../schemas/messageUser");
const voiceUser = require("../schemas/voiceUser");
const { CronJob } = require("cron");

module.exports = () => {
    const sunucu = client.guilds.cache.get(config.guildID);

    const daily = new CronJob("0 0 * * *", () => {
        sunucu.members.cache.forEach(async (member) => {
            await messageUser.findOneAndUpdate({ guildID: sunucu.id, userID: member.user.id }, { $set: { dailyStat: 0 } });
            await voiceUser.findOneAndUpdate({ guildID: sunucu.id, userID: member.user.id }, { $set: { dailyStat: 0 } });
        });
    }, null, true, "Europe/Istanbul");
    daily.start();

    const weekly = new CronJob("0 0 * * 0", () => {
        sunucu.members.cache.forEach(async (member) => {
            await messageUser.findOneAndUpdate({ guildID: sunucu.id, userID: member.user.id }, { $set: { weeklyStat: 0 } });
            await voiceUser.findOneAndUpdate({ guildID: sunucu.id, userID: member.user.id }, { $set: { weeklyStat: 0 } });
        });
    }, null, true, "Europe/Istanbul");
    weekly.start();

    const twoWeekly = new CronJob("0 0 1,15 * *", () => {
        sunucu.members.cache.forEach(async (member) => {
            await messageUser.findOneAndUpdate({ guildID: sunucu.id, userID: member.user.id }, { $set: { twoWeeklyStat: 0 } });
            await voiceUser.findOneAndUpdate({ guildID: sunucu.id, userID: member.user.id }, { $set: { twoWeeklyStat: 0 } });
        });
    }, null, true, "Europe/Istanbul");
    twoWeekly.start();
};

module.exports.conf = {
    name: "ready"
};
