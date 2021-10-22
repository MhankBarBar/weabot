exports.tiktod = async (BarBar, mek, url, antei, help) => {
    try {
        res = await antei.downloader("tiktok", { url: url })
        btn = [{id: `${help.prefix}tikvid ${url}`, text: "▶️ Video"}, {id: `${help.prefix}tikaud ${url}`, text: "🎶 Music"}]
        BarBar.sendButtonsImage(mek.from, help.res(res, "tiktok"), res.video.thumbnail, btn, help.footer(), mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`tiktod err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}

exports.tikaud = async (BarBar, mek, url, antei, help) => {
    try {
        res = await antei.downloader("tiktok", { url: url })
        //BarBar.sendImage(mek.from, res.music.thumbnail, help.res(res, "tiktok"), mek.isGroup ? mek : false)
        BarBar.sendAudio(mek.from, res.music.url, res.music.title, mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`tikaud err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}

exports.tikvid = async (BarBar, mek, url, antei, help) => {
    try {
        res = await antei.downloader("tiktok", { url: url })
        BarBar.sendVideo(mek.from, res.video.url_nowm, "", mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`tikvid err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}
