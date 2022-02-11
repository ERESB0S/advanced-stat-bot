const fs = require("fs");
const client = global.client;

fs.readdir("./src/commands", (err, files) => {
    if (err) console.log(err);
    files.forEach((f) => {
        const props = require(`../commands/${f}`);
        console.log(`[COMMAND] ${props.conf.name} aktif edildi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach((alias) => {
            client.aliases.set(alias, props.conf.name);
        });
    });
});
