const config = require("../configs/config.json");
const points = require("../schemas/points");

module.exports = {
    conf: {
        aliases: ["point", "points"],
        name: "puan",
        help: "puan [ekle-çıkar-gönder] [@Eresbos/ID] [Miktar]",
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
        if (!args[0]) return message.channel.send("Hatalı komut kullanımı! Lütfen yapacağınız işlemi belirtin; `[ekle-çıkar-gönder]`").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
        const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (args[0] === "ekle" || args[0] === "add") {
            if (!message.member.permissions.has(8) && !config.staffRoles.some((e) => message.member.roles.cache.has(e))) return;
            if (!kullanıcı) return message.channel.send("Lütfen puan eklemek istediğiniz kullanıcıyı belirtin.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            if (kullanıcı.user.id === message.author.id) return message.channel.send("Üzgünüm dostum fakat kendine puan ekleyemezsin.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            const puan = Number(args[2]);
            if (!puan) return message.channel.send("Eklenecek puan miktarını belirtmelisin.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            // if (puan < 1) return message.channel.send("Eklenecek puan miktarı 1'den küçük olamaz.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));

            await points.findOneAndUpdate({ guildID: message.guild.id, userID: kullanıcı.user.id }, { $inc: { points: puan } }, { upsert: true });
            const pointData = await points.findOne({ guildID: message.guild.id, userID: kullanıcı.user.id });
            let addedRoles = "";
            if (pointData && client.ranks.some((e) => pointData.points >= e.points && !kullanıcı.hasRole(e.role))) {
                const roles = client.ranks.filter((e) => pointData.points >= e.points && !kullanıcı.hasRole(e.role));
                addedRoles = roles;
                kullanıcı.roles.add(roles[roles.length - 1].role);
                message.guild.channels.cache.get(config.rankLog).send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kullanıcısına ${message.member.toString()} tarafından \`${puan}\` puan eklendi ve ${roles.filter(e => roles.indexOf(e) === roles.length-1).map(e => `<@&${e.role}>`).join("\n")} rolleri verildi!`));
            }
            message.channel.send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kullanıcısına \`${puan}\` adet puan eklendi! \n\n${addedRoles.length > 0 ? `Verilen roller: \n${addedRoles.filter(e => addedRoles.indexOf(e) === addedRoles.length-1).map(e => `<@&${e.role}>`).join("\n")}` : ""}`)).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.onay));
        } else if (args[0] === "çıkar" || args[0] === "sil" || args[0] === "remove") {
            if (!message.member.permissions.has(8) && !config.staffRoles.some((e) => message.member.roles.cache.has(e))) return;
            if (!kullanıcı) return message.channel.send("Lütfen puan silmek istediğiniz kullanıcıyı belirtin.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            if (kullanıcı.user.id === message.author.id) return message.channel.send("Üzgünüm dostum fakat kendine puan ekleyemezsin.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            const puan = Number(args[2]);
            if (!puan) return message.channel.send("Çıkarmak istediğin puan miktarını belirtmelisin.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            // if (puan < 1) return message.channel.send("Çıkarmak istediğin puan miktarı 1'den küçük olamaz.").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            let pointData = await points.findOne({ guildID: message.guild.id, userID: kullanıcı.user.id });
			if (!pointData || pointData && puan > pointData.points) return message.channel.send("Çıkarmak istediğiniz sayı, kişinin mevcut puanından büyük olamaz!").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));

            await points.findOneAndUpdate({ guildID: message.guild.id, userID: kullanıcı.user.id }, { $inc: { points: -puan } }, { upsert: true });
			pointData = await points.findOne({ guildID: message.guild.id, userID: kullanıcı.user.id });
            let removedRoles = "";
			if (pointData && client.ranks.some(e => pointData.points < e.points && kullanıcı.hasRole(e.role))) {
				const roles = client.ranks.filter(e =>  pointData.points < e.points && kullanıcı.hasRole(e.role));
				removedRoles = roles;
				roles.forEach(e => {
					kullanıcı.roles.remove(e.role);
				});
				message.guild.channels.cache.get(config.rankLog).send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kullanıcısından ${message.member.toString()} tarafından \`${puan}\` adet puan çıkarıldı ve kişiden ${roles.map(e => `<@&${e.role}>`).join(", ")} rolleri alındı!`));
			}
			message.channel.send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kullanıcısından \`${puan}\` adet puan çıkarıldı! \n\n${removedRoles.length > 0 ? `Alınan roller: \n${removedRoles.map(e => `<@&${e.role}>`).join("\n")}` : ""}`)).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.onay));
        } else if (args[0] === "gönder" || args[0] === "ver" || args[0] === "yolla") {
            if (kullanıcı.user.id === message.author.id) return message.channel.send("Üzgünüm dostum fakat kendi kendine puan gönderemezsin!");
            const puan = Number(args[2]);
			if (!puan) return message.channel.send("Vermek istediğin puan sayısını belirtmelisin!").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
			// if (puan < 1) return message.channel.send("Verilecek sayı 1'dan küçük olamaz!").them((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));
            let pointData = await points.findOne({ guildID: message.guild.id, userID: message.author.id });
			if (!pointData || pointData && puan > pointData.points) return message.channel.send("Göndereceğin puan kendi puanından yüksek olamaz!").then((e) => e.delete({ timeout: 7000 }) && message.react(config.emojis.red));

            await points.findOneAndUpdate({ guildID: message.guild.id, userID: kullanıcı.user.id }, { $inc: { points: puan } }, { upsert: true });
			await points.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { points: -puan } }, { upsert: true });
            pointData = await points.findOne({ guildID: message.guild.id, userID: message.author.id });
			if (pointData && client.ranks.some(e => pointData.points < e.points && message.member.hasRole(e.role))) {
				const roles = client.ranks.filter(e =>  pointData.points < e.points && message.member.hasRole(e.role));
				roles.forEach(e => {
					message.member.roles.remove(e.role);
				});
			}
            const pointData2 = await points.findOne({ guildID: message.guild.id, userID: kullanıcı.user.id });
			if (pointData2 && client.ranks.some(e => pointData2.points >= e.points && !kullanıcı.hasRole(e.role))) {
				const roles = client.ranks.filter(e => pointData2.points >= e.points && !kullanıcı.hasRole(e.role));
				kullanıcı.roles.add(roles[roles.length - 1].role);
			}

			message.channel.send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kişisine başarıyla \`${puan}\` puan gönderildi!`)).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.onay));
        }
    }
};
