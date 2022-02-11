const config = require("../configs/config.json");

module.exports = {
    conf: {
        aliases: [],
        name: "reload",
        category: "Owner",
        owner: true,
        enabled: true
    },

    run: async (client, message, args) => {
        if (!args[0]) {
            await message.channel.send("Bot yeniden başlatılıyor!").then(() => message.react(config.emojis.onay));
            console.log("[BOT] Bot yeniden başlatıldı.");
            process.exit(0);
        } else {
            const command = args[0];
            let category = client.commands.get(command);
            if (!category) return message.channel.send("Geçerli bir kod ismi belirtmelisin!").then((e) => message.react(config.emojis.red) && e.delete({ timeout: 10000 }));
            category = category.conf.category.replace("Yetkili", "yetkili").replace("Genel", "genel");
            try {
                const msg = await message.channel.send(`\`${command}\` adlı komut yeniden başlatılıyor!`);
                delete require.cache[require.resolve(`./${command}.js`)];
                client.commands.delete(command);
                client.commands.set(command, require(`./${command}.js`));
                console.log(`[COMMAND] ${command} adlı komut yeniden başlatıldı`);
                msg.edit(`\`${command}\` adlı komut yeniden başlatıldı!`).then((e) => message.react(config.emojis.onay) && e.delete({ timeout: 10000 }));
            } catch (e) {
                console.log(e);
                return message.channel.send(`\`${command}\` adlı komut yeniden başlatılamadı!`).then((e) => e.delete({ timeout: 10000 }) && message.react(config.emojis.red));
            }
        }
    }
};
