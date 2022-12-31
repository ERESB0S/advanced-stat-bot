module.exports = {
  conf: {
    aliases: [],
    name: "eval",
    category: "Owner",
    owner: true,
    enabled: true
  },

  run: async (client, message, args, eresbosEmbed) => {
    if (!args[0]) return;
    const code = args.join(" ");

    try {
      var result = clean(await eval(code));
      if (result.includes(client.token)) return message.reply({ content: ":D" });
      message.reply({ embeds: [eresbosEmbed.setDescription(`:inbox_tray: **Input**\n\`\`\`\n${code}\n\`\`\`\n:outbox_tray: **Output**\n\`\`\`js\n${result}\n\`\`\`\n**Status**\nSuccess`).setColor(0x43B581) ] });
    } catch (err) {
      message.reply({ embeds: [eresbosEmbed.setDescription(`:inbox_tray: **Input**\n\`\`\`\n${code}\n\`\`\`\n:outbox_tray: **Output**\n\`\`\`js\n${err}\n\`\`\`\n**Status**\nFailed`).setColor(0xF04747)] });
    }
  }
};

function clean(text) {
  if (typeof text !== "string") text = require("util").inspect(text, { depth: 0 });
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
};
