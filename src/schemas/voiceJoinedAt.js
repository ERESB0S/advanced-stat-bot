const { Schema, model } = require("mongoose");

const şema = Schema({
  guildID: String,
  userID: String,
  date: Number,
});

module.exports = model("voiceJoinedAt", şema);
