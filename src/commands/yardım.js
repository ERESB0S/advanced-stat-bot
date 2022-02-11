const config = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: ["help", "y", "h"],
		name: "yardım",
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
        if (!message.member.permissions.has(8) && !config.staffRoles.some((e) => message.member.roles.cache.has(e))) return;
		const yetkili = client.commands.filter((e) => e.conf.help && e.conf.category === "Yetkili").sort((a, b) => b.conf.help - a.conf.help).map((e) => `\`${prefix}${e.conf.help}\``).join("\n");
		const genel = client.commands.filter((e) => e.conf.help && e.conf.category === "Genel").sort((a, b) => b.conf.help - a.conf.help).map((e) => `\`${prefix}${e.conf.help}\``).join("\n");

		message.channel.send(eresbosEmbed.setDescription(`
**Yetkili komutları;**
${yetkili}

**Genel komutlar;**
${genel}
`).setFooter("[ ] zorunlu | < > isteğe bağlı", message.guild.iconURL({ dynamic: true }))).then(() => message.react(config.emojis.onay));
	}
};
