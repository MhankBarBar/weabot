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
const { captcha, sticker, tiktok, yt, xnxx } = require("./plugins")
const lang = require("./languages")
const moment = require("moment-timezone")
const settings = JSON.parse(read("./src/settings.json"))

moment.tz.setDefault('Asia/Jakarta').locale("id")
let bhs = settings.lang
let prefix = settings.prefix

module.exports = msgHndlr = async (BarBar, mek) => {
    try {
        const { from, sender, pushname, body, quoted, timestamp, type, isGroup, isMedia, id, fromMe, getMedia, mentions } = mek
        const help = new lang[bhs](prefix)
        const anteicodes = new anteiku(settings.anteikey) // signup to antei.codes if you want to get token/apikey
        const cmd = body && body.startsWith(prefix) ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : ""
        const isCmd = body && body.startsWith(prefix) ? true : false
        const args = body ? body.trim().split(/ +/).slice(1) : []
        const time = moment(timestamp * 1000).format("DD/MM/YY HH:mm:ss")
        const groupMetadata = isGroup ? await BarBar.groupMetadata(from) : ""
        const groupId = isGroup ? groupMetadata.id : ""
        const groupName = isGroup ? groupMetadata.subject : ""
        const groupAdmins = isGroup ? await BarBar.getGroupAdmins(groupId) : []
        const groupMembers = isGroup ? groupMetadata.participants : []
        const botIsAdminGroup = isGroup ? groupAdmins.includes(BarBar.user.jid) : false

        //if (BarBar.captcha && BarBar.captcha[sender] && isGroup && type === "buttonsResponseMessage") captcha.handleCaptcha(BarBar, mek)

        const isQuotedImage = quoted && quoted.type === MessageType.image
        const isQuotedVideo = quoted && quoted.type === MessageType.video
        const isQuotedAudio = quoted && quoted.type === MessageType.audio
        const isQuotedDocument = quoted && quoted.type === MessageType.document
        const isQuotedSticker = quoted && quoted.type === MessageType.sticker
        const isUrl = (url) => {
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        const isOwner = settings.owner.includes(sender)

        if (isGroup && isCmd) print(`𓄵green|❑𓄳 ${time} 𓄵green|${cmd}𓄳 from 𓄵blue|${pushname}𓄳 on 𓄵purple|${groupName}𓄳`)
        if (!isGroup && isCmd) print(`𓄵green|❑𓄳 ${time} 𓄵green|${cmd}𓄳 from 𓄵blue|${pushname}𓄳`)
        if (isGroup && !isCmd) print(`𓄵red|❑𓄳 ${time} 𓄵darkYellow|${isMedia && (type !== MessageType.video || type !== MessageType.image) ? type.slice(0, type.match("Message").index) : body.length > 20 ? body.slice(0,20)+"..." : body}𓄳 from 𓄵blue|${pushname}𓄳 on 𓄵purple|${groupName}𓄳`)
        if (!isGroup && !isCmd) print(`𓄵red|❑𓄳 ${time} 𓄵darkYellow|${isMedia && (type !== MessageType.video || type !== MessageType.image) ? type.slice(0, type.match("Message").index) : body.length > 20 ? body.slice(0,20)+"..." : body}𓄳 from 𓄵blue|${pushname}𓄳`)

        switch (cmd) {
            /* -------> [ Help and Menu ] <-------*/
            case "help":
                return BarBar.sendListMsg(from, help.help(pushname), "Menu", help.menuList())

            case "ping":
                return BarBar.sendText(from, "Pong!!")
            /* --------> [ End ] <-----------*/

            /* -------> [ Owner ] <-----------*/
            case "prefix":
                if (!isOwner || args.length === 0) return
                prefix = args[0]
                settings.prefix = prefix
                write("./src/settings.json", JSON.stringify(settings, null, 4))
                return BarBar.sendText(from, `Prefix replaced to : ${prefix}`)

            case "setlang":
                if (!isOwner || args.length === 0) return
                switch (args[0].toLowerCase()) {
                    case "ind":
                    case "en":
                        bhs = args[0].toLowerCase()
                        settings.lang = bhs
                        write("./src/settings.json", JSON.stringify(settings, null, 4))
                        return BarBar.sendText(from, "Done")
                    default:
                        return
                }
            /* -------> [ End ] <------- */

            /* -----> [ Sticker Maker ] <----- */
            case "stiker":
            case "sticker":
            case "s":
                if ((isMedia && type === MessageType.image || isQuotedImage) || (isMedia && type === MessageType.video || isQuotedVideo) && args.length !== 0) {
                    let su = body.slice(cmd.length+prefix.length).trim().split("|")
                    let opt = {}
                    opt.name = su[0]
                    opt.author = su[1]
                    opt.categories = su.length > 2 ? [su[2]] : [""]
                    return await sticker.wm(BarBar, mek, help.err(cmd).sticker, opt)
                } else if ((isMedia && type === MessageType.image || isQuotedImage) || (isMedia && type === MessageType.video || isQuotedVideo)) {
                    return await sticker.basic(BarBar, mek, help.err(cmd).sticker)
                }
                return mek.reply(help.err(cmd).sticker[3])

            case "stikerburn":
            case "stickerburn":
            case "sburn":
                if (isMedia && type === MessageType.image || isQuotedImage) return await sticker.burning(BarBar, mek, anteicodes, help.err(cmd).sticker)
                return mek.reply(help.err(cmd).sticker[0])

            case "stikerlight":
            case "stickerlight":
            case "slight":
                if (isMedia && type === MessageType.image || isQuotedImage) return await sticker.lightning(BarBar, mek, anteicodes, help.err(cmd).sticker)
                return mek.reply(help.err(cmd).sticker[0])

            case "ttp":
                if (quoted && quoted.body) return sticker.ttp(BarBar, mek, quoted.body, anteicodes, help.err(cmd).sticker)
                if (args.length === 0) return mek.reply(help.err(cmd).sticker[1])
                return await sticker.ttp(BarBar, mek, args.join(" "), anteicodes, help.err(cmd).sticker)

            case "attp":
                if (quoted && quoted.body) return sticker.ttp(BarBar, mek, quoted.body, anteicodes, help.err(cmd).sticker)
                if (args.length === 0) return mek.reply(help.err(cmd).sticker[1])
                return await sticker.attp(BarBar, mek, args.join(" "), anteicodes, help.err(cmd).sticker)
            /* ------> [ End ] <------ */

            /* ------> [ Downloader ] <-------*/
            case "tiktok":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("tiktok.com")) {
                    isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                    return await tiktok.tiktod(BarBar, mek, args[0], anteicodes, help)
                } else {
                    return mek.reply(help.err().invalid)
                }

            case "tikvid":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("tiktok.com")) {
                    isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                    return await tiktok.tikvid(BarBar, mek, args[0], anteicodes, help)
                } else {
                    return mek.reply(help.err().invalid)
                }

            case "tikaud":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("tiktok.com")) {
                    isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                    return await tiktok.tikaud(BarBar, mek, args[0], anteicodes, help)
                } else {
                    return mek.reply(help.err().invalid)
                }

            case "tweet":
            case "twitter":
                return mek.reply("Sedang dalam proses perkembangan")
                /* TODO */

            case "yt":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("youtu")) {
                    isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                    return await yt.yt(BarBar, mek, args[0], anteicodes, help)
                } else {
                    return mek.reply(help.err().invalid)
                }

            case "yta":
            case "ytmp3":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("youtu")) {
                    isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                    return await yt.yta(BarBar, mek, args[0], anteicodes, help)
                } else {
                    return mek.reply(help.err().invalid)
                }

            case "ytv":
            case "ytmp4":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("youtu")) {
                    isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                    return await yt.ytv(BarBar, mek, args[0], anteicodes, help)
                } else {
                    return mek.reply(help.err().invalid)
                }

            case "xnxx":
                if (args.length === 0) return mek.reply(help.err(cmd).deel)
                if (isUrl(args[0]) && args[0].includes("xnxx")) {
                    if (args.length === 1) {
                        isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                        return await xnxx.xnxx(BarBar, mek, args[0], anteicodes, help)
                    } else if (args.length === 2) {
                        switch (args[1].toLowerCase()) {
                            case "sd":
                                isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                                return await xnxx.sd(BarBar, mek, args[0], anteicodes, help)
                            case "hd":
                                isGroup ? mek.reply(help.wait()) : BarBar.sendText(from, help.wait())
                                return await xnxx.hd(BarBar, mek, args[0], anteicodes, help)
                            default:
                                return
                        }
                    }
                } else {
                    return mek.reply(help.err().invalid)
                }
            /* -------> [ End ] <-------- */
            default:
                return
        }
    } catch (e) {
        print(`Error : 𓄵red|${e}𓄳`)
    }
}
