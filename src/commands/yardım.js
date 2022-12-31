const config = require("../configs/config.json");

module.exports = {
	conf: {
		aliases: ["help", "y", "h"],
		name: "yardım",
		enabled: true
	},

	/**
	 * @param { import("discord.js").Client } client 
	 * @param { import("discord.js").Message } message 
	 * @param { Array<String> } args 
	 * @param { import("discord.js").EmbedBuilder } eresbosEmbed 
	 * @param { String<String> } prefix 
	 * @returns 
	 */
	run: async (client, message, args, eresbosEmbed, prefix) => {
		if (!message.member.permissions.has("Administrator") && !config.staffRoles.some((e) => message.member.roles.cache.has(e))) return;
		const yetkili = client.commands.filter((e) => e.conf.help && e.conf.category === "Yetkili").sort((a, b) => b.conf.help - a.conf.help).map((e) => `\`${prefix}${e.conf.help}\``).join("\n");
		const genel = client.commands.filter((e) => e.conf.help && e.conf.category === "Genel").sort((a, b) => b.conf.help - a.conf.help).map((e) => `\`${prefix}${e.conf.help}\``).join("\n");

		message.reply({ embeds: [eresbosEmbed.setDescription(`
**Yetkili komutları;**
${yetkili}

**Genel komutlar;**
${genel}
`).setFooter({ text: "[ ] zorunlu | < > isteğe bağlı", iconURL: message.guild.iconURL({ forceStatic: true }) })] }).then(() => message.react(config.emojis.onay));
	}
};
