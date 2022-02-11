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
        if (result.includes(client.token)) return message.channel.send(":D");
        message.channel.send(eresbosEmbed.setDescription(`
:inbox_tray: **Input**
\`\`\`
${code}
\`\`\`
:outbox_tray: **Output**
\`\`\`js
${result}
\`\`\`
**Status**
Success
        `).setColor(0x43B581));
        } catch (err) {
            message.channel.send(eresbosEmbed.setDescription(`
:inbox_tray: **Input**
\`\`\`
${code}
\`\`\`
:outbox_tray: **Output**
\`\`\`js
${err}
\`\`\`
**Status**
Failed
        `).setColor(0xF04747));
        }
    }
};

function clean(text) {
    if (typeof text !== "string") text = require("util").inspect(text, { depth: 0 });
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
}
