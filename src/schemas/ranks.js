const { Schema, model } = require("mongoose");

const şema = Schema({
  guildId: { type: String, default: "" },
  pointSystem: { type: Boolean, default: false },
  ranks: { type: Array, default: [] },
});

module.exports = model("ranks", şema);
