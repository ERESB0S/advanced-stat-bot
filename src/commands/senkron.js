const config = require("../configs/config.json");
const points = require("../schemas/points");

module.exports = {
    conf: {
        aliases: ["senkronize"],
        name: "senkron",
        help: "senkron [Kullanıcı/Rol] [@Eresbos/@Rol/ID]",
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
        if (!message.member.permissions.has(8)) return;
        if (["kullanıcı","kişi","user"].some((e) => args[0] === e)) {
            if (!args[1]) return message.channel.send(eresbosEmbed.setDescription("Üzgünüm dostum fakat geçerli bir kullanıcı belirtmelisin.")).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            const kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
            if (!kullanıcı) return message.channel.send(eresbosEmbed.setDescription("Üzgünüm dostum fakat belirttiğin kullanıcıyı bulamıyorum.")).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));

            if (client.ranks.some((e) => kullanıcı.hasRole(e.rankRole))) {
                let rank = client.ranks.filter((e) => kullanıcı.hasRole(e.rankRole));
                rank = rank[rank.length-1];
                await points.findOneAndUpdate({ guildID: message.guild.id, userID: kullanıcı.user.id }, { $set: { points: rank.points } }, { upsert: true });
                message.channel.send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kullanıcısında ${Array.isArray(rank.rankRole) ? rank.rankRole.map((e) => `<@&${e}>`).join(", ") : `<@&${rank.rankRole}>`} rolü bulundu ve puanı \`${rank.points}\` olarak değiştirildi.`)).then(() => message.react(config.emojis.onay));
            } else return message.channel.send(eresbosEmbed.setDescription(`${kullanıcı.toString()} kullanıcısında ayarlı yetkili rolü bulunamadı!`)).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
        } else if (["rol","role"].some((e) => args[0] === e)) {
            if (!args[1]) return message.channel.send(eresbosEmbed.setDescription("Üzgünüm dostum fakat geçerli bir rol belirtmelisin.")).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!rol) return message.channel.send(eresbosEmbed.setDescription("Üzgünüm dostum fakat belirttiğin rolü bulamıyorum.")).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            if (rol.members.length === 0) return message.channel.send(eresbosEmbed.setDescription("Belirttiğin rolde kullanıcı bulunmadığı için işlem iptal edildi.")).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));

            rol.members.forEach(async (member) => {
                if (member.user.bot) return;
                if (client.ranks.some((e) => member.hasRole(e.rankRole))) {
                    let rank = client.ranks.filter((e) => member.hasRole(e.rankRole));
                    rank = rank[rank.length-1];
                    await points.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { points: rank.points } }, { upsert: true });
                    message.channel.send(eresbosEmbed.setDescription(`${member.toString()} kullanıcısında ${Array.isArray(rank.rankRole) ? rank.rankRole.map(e => `<@&${e}>`).join(", ") : `<@&${rank.rankRole}>`} rolü bulundu ve puanı \`${rank.points}\` olarak değiştirildi.`)).then(() => message.react(config.emojis.onay));
                } else return message.channel.send(eresbosEmbed.setDescription(`${member.toString()} kullanıcısında ayarlı yetkili rolü bulunamadı!`)).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            });
        } else return message.channel.send(eresbosEmbed.setDescription("Üzgünüm dostum fakat bir argüman belirtmelisin! `Kullanıcı-Rol`")).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
    }
};
