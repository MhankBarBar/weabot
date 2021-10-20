const {
	MessageType,
	Mimetype
} = require("@adiwajshing/baileys")
const {
	readFileSync: read,
	writeFileSync: write
} = require("fs")
const { print } = require("./utils/col")
//const { handleCaptcha } = require("./plugins/captcha")
const moment = require("moment-timezone")

moment.tz.setDefault('Asia/Jakarta').locale('id')
let prefix = "#"

module.exports = msgHndlr = async (BarBar, mek) => {
	try {
		const { from, sender, pushname, body, quoted, timestamp, type, isGroup, isMedia, id, fromMe, getMedia, mentions } = mek
		const cmd = body && body.startsWith(prefix) ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : ""
		const isCmd = body && body.startsWith(prefix) ? true : false
		const time = moment(timestamp * 1000).format("DD/MM/YY HH:mm:ss")
		const groupMetadata = isGroup ? await BarBar.groupMetadata(from) : ""
		const groupId = isGroup ? groupMetadata.id : ""
		const groupName = isGroup ? groupMetadata.subject : ""
		const groupAdmins = isGroup ? await BarBar.getGroupAdmins(groupId) : ""
		const groupMembers = isGroup ? groupMetadata.participants : ""
		const botIsAdminGroup = isGroup ? groupAdmins.includes(BarBar.user.jid) : false

		//if (BarBar.captcha && BarBar.captcha[sender] && isGroup && type === "buttonsResponseMessage") handleCaptcha(BarBar, mek)

		const isQuotedImage = quoted && quoted.type === MessageType.image
		const isQuotedVideo = quoted && quoted.type === MessageType.video
		const isQuotedAudio = quoted && quoted.type === MessageType.audio
		const isQuotedDocument = quoted && quoted.type === MessageType.document
		const isQuotedSticker = quoted && quoted.type === MessageType.sticker

		if (isGroup && isCmd) print(`𓄵green|❑𓄳 ${time} 𓄵green|${cmd}𓄳 from 𓄵blue|${pushname}𓄳 on 𓄵purple|${groupName}𓄳`)
		if (!isGroup && isCmd) print(`𓄵green|❑𓄳 ${time} 𓄵green|${cmd}𓄳 from 𓄵blue|${pushname}𓄳`)
		if (isGroup && !isCmd) print(`𓄵red|❑𓄳 ${time} 𓄵darkYellow|${isMedia && (type != MessageType.video || type != MessageType.image) ? type.slice(0, type.match("Message").index) : body.length > 20 ? body.slice(0,20)+"..." : body}𓄳 from 𓄵blue|${pushname}𓄳 on 𓄵purple|${groupName}𓄳`)
		if (!isGroup && !isCmd) print(`𓄵red|❑𓄳 ${time} 𓄵darkYellow|${isMedia && (type != MessageType.video || type != MessageType.image) ? type.slice(0, type.match("Message").index) : body.length > 20 ? body.slice(0,20)+"..." : body}𓄳 from 𓄵blue|${pushname}𓄳`)

		switch (cmd) {
			case "ping":
				return BarBar.sendText(from, "Pong!!")
			case "prefix":
				prefix = body.split(" ")[1]
				return BarBar.sendText(from, `Prefix replaced to : ${prefix}`)
			case "stiker":
			case "sticker":
			case "s":
				if (isMedia && type === MessageType.image || isQuotedImage) {
					let buff = isMedia ? await mek.getMedia() : await mek.quoted.getMedia()
					return BarBar.sendImageAsSticker(mek, buff)
				} else {
					return mek.reply(`Kirim gambar dengan caption ${prefix}sticker`)
				}
			default:
				return
		}
	} catch (e) {
		print(`Error : 𓄵red|${e}𓄳`)
	}
}
