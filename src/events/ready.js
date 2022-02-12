const client = global.client;
const config = require("../configs/config.json");

module.exports = () => {
    const VoiceChannel = client.channels.cache.get(config.voiceChannel);
    if (VoiceChannel && client.voice.channelID !== VoiceChannel || !client.voice.channelID) VoiceChannel.join().then(e => {
        e.voice.setSelfDeaf(true);
    });
    setInterval(() => {
        const VoiceChannel = client.channels.cache.get(config.voiceChannel);
        if (VoiceChannel && client.voice.channelID !== VoiceChannel || !client.voice.channelID) VoiceChannel.join();
    }, 30000);
    client.on('warn', m => console.log(`[WARN] - ${m}`));
    client.on('error', m => console.log(`[ERROR] - ${m}`));
    process.on('uncaughtException', error => console.log(`[ERROR] - ${error}`));
    process.on('unhandledRejection', (err) => console.log(`[ERROR] - ${err}`));
};

module.exports.conf = {
    name: "ready"
};
