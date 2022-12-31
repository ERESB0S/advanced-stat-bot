const { EmbedBuilder } = require("discord.js");

module.exports = {
  conf: {
    aliases: ["lt", "lb", "leaderboard"],
    name: "lidertablosu",
    category: "Owner",
    owner: true,
    enabled: true
  },

  run: async (client, message, args, eresbosEmbed) => {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    if (channel) await channel.send({ embeds: [new EmbedBuilder().setDescription("Lider tablosu `mesaj` sıralama mesajıdır.")] });
    if (channel) await channel.send({ embeds: [new EmbedBuilder().setDescription("Lider tablosu `ses` sıralama mesajıdır.")] });
  }
};
