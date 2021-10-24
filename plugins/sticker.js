const { MessageType } = require("@adiwajshing/baileys")
const { writeFileSync: write, unlinkSync: remove } = require("fs")
const upimg = require("../lib/upimg")
const rand = (ext) => (Math.floor(Math.random() * 10000)).toString() + ext 

exports.basic = async (BarBar, mek, err) => {
    try {
        return BarBar.sendImageAsSticker(mek, mek.isMedia ? await mek.getMedia() : await mek.quoted.getMedia(), mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`sticker err : ${e}`)
        mek.reply(err[2])
    }
}

exports.wm = async (BarBar, mek, err, opts={}) => {
    try {
        return BarBar.sendImageAsSticker(mek, mek.isMedia ? await mek.getMedia() : await mek.quoted.getMedia(), mek.isGroup ? mek : false, opts)
    } catch (e) {
        console.log(`sticker err : ${e}`)
        mek.reply(err[2])
    }
}

exports.lightning = async (BarBar, mek, antei, err) => {
    let temp = rand(".jpg")
    write(temp, mek.isMedia ? await mek.getMedia() : await mek.quoted.getMedia())
    upimg(temp).then(async(x) => {
        try {
            BarBar.sendImageAsSticker(mek, await antei.images("lightning", { url: x.image.url }), mek.isGroup ? mek : false)
        } catch (e) {
            console.log(`antei lightning err : ${e}`)
            mek.reply(err[2])
        }
    }).catch((x) => {
        console.log(`upimg err : ${x}`)
        mek.reply(err[2])
    })
    remove(temp)
}

exports.burning = async (BarBar, mek, antei, err) => {
    let temp = rand(".jpg")
    write(temp, mek.isMedia ? await mek.getMedia() : await mek.quoted.getMedia())
    upimg(temp).then(async(x) => {
        try {
            BarBar.sendImageAsSticker(mek, await antei.images("burning_fire", { url: x.image.url }), mek.isGroup ? mek : false)
        } catch (e) {
            console.log(`antei burning err : ${e}`)
            mek.reply(err[2])
        }
    }).catch((x) => {
        console.log(`upimg err : ${x}`)
        mek.reply(err[2])
    })
    remove(temp)
}

exports.attp = async (BarBar, mek, text, antei, err) => {
    try {
        return BarBar.sendImageAsSticker(mek, await antei.images("attp", { text: text }), mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`antei attp err : ${e}`)
        return mek.reply(err[2])
    }
}

exports.ttp = async (BarBar, mek, text, antei, err) => {
    try {
        return BarBar.sendImageAsSticker(mek, await antei.images("ttp", { text: text }), mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`antei ttp err : ${e}`)
        return mek.reply(err[2])
    }
}
