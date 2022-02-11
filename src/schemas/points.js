const { Schema, model } = require("mongoose");

const şema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  points: { type: Number, default: 0 }
});

module.exports = model("points", şema);
