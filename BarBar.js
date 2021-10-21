const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys")
const {
    readFileSync: read,
    writeFileSync: write,
    unlinkSync: remove
} = require("fs")
const upimg = require("./lib/upimg")
const anteiku = require("./lib/antei")
const { getBuffer } = require("./lib/functions")
const { print } = require("./utils/col")
//const { handleCaptcha } = require("./plugins/captcha")
const { ind } = require("./languages")
const moment = require("moment-timezone")

moment.tz.setDefault('Asia/Jakarta').locale('id')
let prefix = "#"

module.exports = msgHndlr = async (BarBar, mek) => {
    try {
        const { from, sender, pushname, body, quoted, timestamp, type, isGroup, isMedia, id, fromMe, getMedia, mentions } = mek
        const help = new ind(prefix)
        const anteicodes = new anteiku("Set apikey on here") // signup to antei.codes if you want to get token/apikey
        const cmd = body && body.startsWith(prefix) ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : ""
        const isCmd = body && body.startsWith(prefix) ? true : false
        const args = body ? body.trim().split(/ +/).slice(1) : []
        const time = moment(timestamp * 1000).format("DD/MM/YY HH:mm:ss")
        const groupMetadata = isGroup ? await BarBar.groupMetadata(from) : ""
        const groupId = isGroup ? groupMetadata.id : ""
        const groupName = isGroup ? groupMetadata.subject : ""
        const groupAdmins = isGroup ? await BarBar.getGroupAdmins(groupId) : []
        const groupMembers = isGroup ? groupMetadata.participants : []
        const botIsAdminGroup = isGroup ? groupAdmins.includes(BarBar.user.jid) : false

        //if (BarBar.captcha && BarBar.captcha[sender] && isGroup && type === "buttonsResponseMessage") handleCaptcha(BarBar, mek)

        const isQuotedImage = quoted && quoted.type === MessageType.image
        const isQuotedVideo = quoted && quoted.type === MessageType.video
        const isQuotedAudio = quoted && quoted.type === MessageType.audio
        const isQuotedDocument = quoted && quoted.type === MessageType.document
        const isQuotedSticker = quoted && quoted.type === MessageType.sticker
        const isUrl = (url) => {
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }

        if (isGroup && isCmd) print(`𓄵green|❑𓄳 ${time} 𓄵green|${cmd}𓄳 from 𓄵blue|${pushname}𓄳 on 𓄵purple|${groupName}𓄳`)
        if (!isGroup && isCmd) print(`𓄵green|❑𓄳 ${time} 𓄵green|${cmd}𓄳 from 𓄵blue|${pushname}𓄳`)
        if (isGroup && !isCmd) print(`𓄵red|❑𓄳 ${time} 𓄵darkYellow|${isMedia && (type != MessageType.video || type != MessageType.image) ? type.slice(0, type.match("Message").index) : body.length > 20 ? body.slice(0,20)+"..." : body}𓄳 from 𓄵blue|${pushname}𓄳 on 𓄵purple|${groupName}𓄳`)
        if (!isGroup && !isCmd) print(`𓄵red|❑𓄳 ${time} 𓄵darkYellow|${isMedia && (type != MessageType.video || type != MessageType.image) ? type.slice(0, type.match("Message").index) : body.length > 20 ? body.slice(0,20)+"..." : body}𓄳 from 𓄵blue|${pushname}𓄳`)

        switch (cmd) {
            /* -------> [ Help and Menu ] <-------*/
            case "help":
                return BarBar.sendListMsg(from, help.help(pushname), "𑁍 Fitur yang tersedia 𑁍", help.menuList())
            case "ping":
                return BarBar.sendText(from, "Pong!!")
            case "prefix":
                prefix = args[0]
                return BarBar.sendText(from, `Prefix replaced to : ${prefix}`)
            /* -------> [ End ] <------- */

            /* -----> [ Sticker Maker ] <----- */
            case "stiker":
            case "sticker":
            case "s":
                if (isMedia && type === MessageType.image || isQuotedImage) {
                    let buff = isMedia ? await mek.getMedia() : await mek.quoted.getMedia()
                    return BarBar.sendImageAsSticker(mek, buff)
                } else {
                    return mek.reply(`Kirim gambar dengan caption ${prefix}sticker`)
                }
            case "stikerburn":
            case "stickerburn":
            case "sburn":
                if (isMedia && type === MessageType.image || isQuotedImage) {
                    let buff = isMedia ? await mek.getMedia() : await mek.quoted.getMedia()
                    write("burn.jpg", buff)
                    upimg("burn.jpg")
                    .then(async(x) => {
                        let buf = await anteicodes.images("burning_fire", { url: x.image.url })
                        BarBar.sendImageAsSticker(mek, buf)
                    })
                    .catch(() => mek.reply("Terjadi kesalahan"))
                    remove("burn.jpg")
                    return
                } else {
                    return mek.reply(`Kirim gambar dengan caption ${prefix}sburn`)
                }
            case "stikerlight":
            case "stickerlight":
            case "slight":
                if (isMedia && type === MessageType.image || isQuotedImage) {
                    let buff = isMedia ? await mek.getMedia() : await mek.quoted.getMedia()
                    write("light.jpg", buff)
                    upimg("light.jpg")
                    .then(async(x) => {
                        let buf = await anteicodes.images("lightning", { url: x.image.url })
                        BarBar.sendImageAsSticker(mek, buf)
                    })
                    .catch((x) => {
                        console.log(x)
                        mek.reply("Terjadi kesalahan")
                    })
                    remove("light.jpg")
                    return
                } else {
                    return mek.reply(`Kirim gambar dengan caption ${prefix}slight`)
                }
            /* ------> [ End ] <------ */

            /* ------> [ Downloader ] <-------*/
            case "tiktok":
                if (args.length === 0) return mek.reply(`Contoh : ${prefix}tiktok https://vt.tiktok.com/blablabla/`)
                if (isUrl(args[0]) && args[0].includes("tiktok.com")) {
                    try {
                        let res = await anteicodes.downloader("tiktok", { url: args[0] })
                        let capt = `👍 Likes : ${res.likes}\n🗯️ Comments : ${res.comments}\n↪️ Shares : ${res.shares}\n▶️ Plays : ${res.plays}\n🎶 ${res.music.title} (${res.music.author})\n👤 ${res.author.username} (${res.author.name})\n📃 ${res.description}`
                        return BarBar.sendVideo(from, res.video.url_nowm, capt, isGroup ? mek : false)
                    } catch (e) {
                        return mek.reply("Terjadi kesalahan")
                    }
                } else {
                    return mek.reply("Url tidak valid")
                }
            case "tweet":
            case "twitter":
                return mek.reply("Sedang dalam proses perkembangan")
                /* TODO */
            case "yta":
            case "ytmp3":
                if (args.length === 0) return mek.reply(`Contoh : ${prefix}yta https://youtu.be/blabla`)
                if (isUrl(args[0]) && args[0].includes("youtu")) {
                    try {
                        let res = await anteicodes.downloader("yta", { url: args[0] })
                        let capt = `Title : ${res.title}\nLikes : ${res.likes}\nViews : ${res.views}`
                        BarBar.sendImage(from, res.thumb, capt, isGroup ? mek : false)
                        return BarBar.sendAudio(from, res.result, res.title, isGroup ? mek : false)
                    } catch (e) {
                        return mek.reply("Terjadi kesalahan")
                    }
                } else {
                    return mek.reply("Url tidak valid")
                }
            case "ytv":
            case "ytmp4":
                if (args.length === 0) return mek.reply(`Contoh : ${prefix}ytv https://youtu.be/blabla`)
                if (isUrl(args[0]) && args[0].includes("youtu")) {
                    try {
                        let res = await anteicodes.downloader("ytv", { url: args[0] })
                        let capt = `Title : ${res.title}\nLikes : ${res.likes}\nViews : ${res.views}`
                        return BarBar.sendVideo(from, res.result, capt, isGroup ? mek : false)
                    } catch (e) {
                        return mek.reply("Terjadi kesalahan")
                    }
                } else {
                    return mek.reply("Url tidak valid")
                }
            case "xnxx":
                return mek.reply("Sedang dalam proses perkembangan")
                /* TODO */
            /* -------> [ End ] <-------- */
            default:
                return
        }
    } catch (e) {
        print(`Error : 𓄵red|${e}𓄳`)
    }
}
