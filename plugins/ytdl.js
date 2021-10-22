exports.yt = async (BarBar, mek, url, antei, help) => {
    try {
        res = await antei.downloader("ytv", { url: url })
        btn = [{id: `${help.prefix}ytv ${url}`, text: "▶️ Video"}, {id: `${help.prefix}yta ${url}`, text: "🎶 Music"}]
        BarBar.sendButtonsImage(mek.from, help.res(res, "youtube"), res.thumb, btn, help.footer(), mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`yt err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}

exports.yta = async (BarBar, mek, url, antei, help) => {
    try {
        res = await antei.downloader("yta", { url: url })
        BarBar.sendAudio(mek.from, res.result, res.title, mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`yta err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}

exports.ytv = async (BarBar, mek, url, antei, help) => {
    try {
        res = await antei.downloader("ytv", { url: url })
        BarBar.sendVideo(mek.from, res.result, "", mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`ytv err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}
