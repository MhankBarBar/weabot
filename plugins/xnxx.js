exports.xnxx = async (BarBar, mek, url, antei, help) => {
    try {
        let res = await antei.downloader("xnxx", { url: url })
        btn = [{id: `${help.prefix}xnxx ${url} sd`, text: "▶️ SD Quality"}, {id: `${help.prefix}xnxx ${url} hd`, text: "▶️ HD Quality"}]
        BarBar.sendButtonsImage(mek.from, help.res(res, "xnxx"), res.thumbnail, btn, help.footer(), mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`xnxx err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}

exports.sd = async (BarBar, mek, url, antei, help) => {
    try {
        let res = await antei.downloader("xnxx", { url: url })
        if ((parseInt(res.result.sd.filesize.split("MB")[0]) >= 18) || !["KB","MB"].includes(res.filesize.split(" ")[1])) return mek.reply(help.large(res.result.sd.video))
        BarBar.sendVideo(mek.from, res.result.sd.video, "", mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`xnxx sd err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}

exports.hd = async (BarBar, mek, url, antei, help) => {
    try {
        let res = await antei.downloader("xnxx", { url: url })
        if ((parseInt(res.result.hd.filesize.split("MB")[0]) >= 18) || !["KB","MB"].includes(res.filesize.split(" ")[1])) return mek.reply(help.large(res.result.hd.video))
        BarBar.sendVideo(mek.from, res.result.hd.video, "", mek.isGroup ? mek : false)
    } catch (e) {
        console.log(`xnxx hd err : ${e}`)
        mek.reply(help.err().sticker[2])
    }
}
