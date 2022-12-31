const config = require("../configs/config.json");
const { EmbedBuilder } = require("discord.js");
const client = global.client;
let sended = false;

/**
 * @param { import("discord.js").Message } message 
 * @returns 
 */
module.exports = async (message) => {
  const prefix = config.prefix.find((e) => message.content.toLowerCase().startsWith(e));
  if (message.author.bot || !message.guild || !prefix) return;
  let args = message.content.substring(prefix.length).trim().split(" ");
  const command = args[0].toLowerCase();

  const eresbosEmbed = new EmbedBuilder().setColor(message.member.displayHexColor).setFooter({ text: config.activity, iconURL: message.guild.iconURL({ dynamic: true }) }).setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ forceStatic: true }), url: "https://eresbos.xyz" }).setTimestamp();
  args = args.splice(1);
  const cmd = client.commands.has(command) ? client.commands.get(command) : client.commands.get(client.aliases.get(command));

  if (cmd) {
    if (!cmd || (cmd.conf.owner && !config.botOwners.includes(message.author.id)) || !cmd.conf.enabled) return;
    const cooldown = cmd.conf.cooldown || 3000;
    const cd = client.cooldown.get(message.author.id);
    if (cd) {
      const diff = Date.now() - cd.lastUsage;
      if (diff < cooldown)
        if (!sended) {
          sended = true;
          return message.reply({ content: `Bu komutu tekrar kullanmak için \`${Number(((cooldown - diff) / 1000).toFixed(2))} saniye\` daha beklemelisin!` }).then((e) => setTimeout(() => e.delete(), (cooldown - diff)));
        }
    } else client.cooldown.set(message.author.id, { cooldown, lastUsage: Date.now() });
    cmd.run(client, message, args, eresbosEmbed, prefix);
  }
};

module.exports.conf = {
  name: "messageCreate",
};
