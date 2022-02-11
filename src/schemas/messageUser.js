const { Schema, model } = require("mongoose");

const şema = Schema({
	guildID: String,
	userID: String,
	topStat: { type: Number, default: 0 },
	dailyStat: { type: Number, default: 0 },
	weeklyStat: { type: Number, default: 0 },
	twoWeeklyStat: { type: Number, default: 0 },
	timeout: { type: Number, default: Date.now() },
});

module.exports = model("messageUser", şema);
