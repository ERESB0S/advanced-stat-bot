const mongoose = require("mongoose");
const settings = require("../configs/settings.json");

mongoose.connect(settings.mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

mongoose.connection.on("connected", () => {
    console.log(`[MONGOOSE] Mongo bağlantısı kuruldu!`);
});

mongoose.connection.on("disconnected", () => {
    console.log(`[MONGOOSE] Mongo bağlantısı kesildi!`);
});

mongoose.connection.on("error", () => {
    console.error(`[MONGOOSE] Mongo bağlantısı kurulurken bir hata oluştu!`);
});
