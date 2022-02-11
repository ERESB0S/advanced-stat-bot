const { GuildMember } = require("discord.js");
const { emojis } = require("../configs/config.json");
const moment = require("moment");

module.exports = async (client) => {

  /**
   * @param { Number } value 
   * @param { Number } maxValue 
   * @param { Number } size 
   * @returns 
   */
  	client.progressBar = (value, maxValue, size) => {
		const progress = Math.round(
			size * (value / maxValue > 1 ? 1 : value / maxValue)
		);
		const emptyProgress = size - progress > 0 ? size - progress : 0;

		const progressText = emojis.fill.repeat(progress);
		const emptyProgressText = emojis.empty.repeat(emptyProgress);

		return emptyProgress > 0
			? progress === 0
			? emojis.emptyStart + progressText + emptyProgressText + emojis.emptyEnd
			: emojis.fillStart + progressText + emptyProgressText + emojis.emptyEnd
			: emojis.fillStart + progressText + emptyProgressText + emojis.fillEnd;
	};

	GuildMember.prototype.hasRole = function (role, every = true) {
		return (
			(Array.isArray(role) && 
			((every && role.every((e) => this.roles.cache.has(e))) || 
			(!every && role.some((e) => this.roles.cache.has(e))))) || 
			(!Array.isArray(role) && this.roles.cache.has(role))
		);
	};

	/**
	 * @param { Number } time 
	 * @returns 
	 */
	client.getTime = (time) => {
        // if (!time) throw new ReferenceError("Time Is Not Defined");
        if (isNaN(time) || time.toLocaleString().includes('-')) throw new TypeError("Invalid Argument : Time");
        let date = moment.duration(time)._data;

        if (date.years) return `${date.years} yıl${date.months ? `, ${date.months} ay` : ``}${date.days ? `, ${date.days} gün` : ``}`
        if (date.months) return `${date.months} ay${date.days ? `, ${date.days} gün` : ``}${date.hours ? `, ${date.hours} saat` : ``}`
        if (date.days) return `${date.days} gün${date.hours ? `, ${date.hours} saat` : ``}${date.minutes ? `, ${date.minutes} dakika`: ``}`;
        if (date.hours) return `${date.hours} saat${date.minutes ? `, ${date.minutes} dakika` : ``}${date.seconds ? `, ${date.seconds} sn.` : ``}`;
		if (date.minutes) return `${date.minutes} dakika${date.seconds ? `, ${date.seconds} sn.` : ``}`;
		if (date.seconds) return `${date.seconds} sn.`;
        // if (date.minutes) return date.minutes < 5 ? `birkaç dakika` : date.minutes > 45 ? `yaklaşık 1 saat` : `${date.minutes} dakika`;
        // if (date.seconds) return date.seconds < 15 ? `birkaç saniye` : date.seconds > 45 ? `yaklaşık 1 dakika` : `${date.seconds} saniye`;
    };
};
