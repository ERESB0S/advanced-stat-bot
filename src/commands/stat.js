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
     * @param { Client } client 
     * @param { Message } message 
     * @param { Array<String> } args 
     * @param { MessageEmbed } eresbosEmbed 
     * @returns
     */
    run: async (client, message, args, eresbosEmbed) => {
        const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: kullanıcı.id });
        const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: kullanıcı.id });
        const mesajVeriler = await messageUserChannel.find({ guildID: message.guild.id, userID: kullanıcı.id }).sort({ channelData: -1 });
        const sesVeriler = await voiceUserChannel.find({ guildID: message.guild.id, userID: kullanıcı.id }).sort({ channelData: -1 });

        let messageTop;
        let voiceTop;
        const kanalSayısı = sesVeriler ? sesVeriler.length : 0;
        mesajVeriler.length > 0 ? messageTop = mesajVeriler.splice(0, 10).map((e, i) => `\`${i+1}.\` ${message.guild.channels.cache.get(e.channelID) ? capitalizeIt(message.guild.channels.cache.get(e.channelID).name.replace("#", "").replace("-", " ")) : "Kanal Silinmiş"}: \`${Number(e.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "`Veri Bulunamadı!`";
        sesVeriler.length > 0 ? voiceTop = sesVeriler.splice(0, 10).map((e, i) => `\`${i+1}.\` ${message.guild.channels.cache.get(e.channelID) ? message.guild.channels.cache.get(e.channelID).name : "Kanal Silinmiş"}: \`${client.getTime(e.channelData)}\``).join("\n") : voiceTop = "`Veri bulunamadı!`";

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
        parents = parents.filter((u) => u.data !== 0).sort((n, r) => r.data - n.data);

        eresbosEmbed.setThumbnail(kullanıcı.user.avatarURL({ dynamic: true }));
        eresbosEmbed.setDescription(`${kullanıcı.user.toString()} kullanıcısının genel sunucu ses ve mesaj istatistikleri;`);
        eresbosEmbed.addField("❯ Kategori Bilgileri:", `
\`•\` Toplam: \`${client.getTime(voiceData ? voiceData.topStat : 0)}\`
${parents.length > 0 ? parents.map((e) => `\`•\` ${e.name}: \`${client.getTime(e.data)}\` `).join("\n") : ""}
`);
        eresbosEmbed.addField(`❯ Kanal Sıralaması: (Toplam ${kanalSayısı} Kanal)`, voiceTop);
        eresbosEmbed.addField("❯ Mesaj Bilgileri:", `\`•\` Toplam: \`${messageData ? messageData.topStat : 0}\` \n\`•\` 1 Gün: \`${messageData ? messageData.dailyStat : 0}\` \n\`•\` 1 Hafta: \`${messageData ? messageData.weeklyStat : 0}\` \n\`•\` 2 Hafta: \`${messageData ? messageData.twoWeeklyStat : 0}\``);
        eresbosEmbed.addField(`❯ Mesaj Sıralaması: (Toplam: ${messageData ? messageData.topStat : 0})`, messageTop);
        message.channel.send(eresbosEmbed).then(() => message.react(config.emojis.onay));
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
}
