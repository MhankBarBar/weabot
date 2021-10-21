const fs = require('fs')
const { spawn } = require('child_process')
const { getRandom } = require('./functions')
const ff = require('fluent-ffmpeg')

exports.createExif = (pack, auth) => {
    const code = [0x00,0x00,0x16,0x00,0x00,0x00]
    const exif = {"sticker-pack-id": "com.mhankbarbar.moe", "sticker-pack-name": pack, "sticker-pack-publisher": auth, "android-app-store-link": "https://play.google.com/store/apps/details?id=com.marsvard.stickermakerforwhatsap", "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857"}
    let len = JSON.stringify(exif).length
    if (len > 256) {
        len = len - 256
        code.unshift(0x01)
    } else {
        code.unshift(0x00)
    }
    if (len < 16) {
        len = len.toString(16)
        len = "0" + len
    } else {
        len = len.toString(16)
    }
    const _ = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
    const __ = Buffer.from(len, "hex")
    const ___ = Buffer.from(code)
    const ____ = Buffer.from(JSON.stringify(exif))
    fs.writeFileSync('./sticker/data.exif', Buffer.concat([_, __, ___, ____]), function (err) {
        if (err) return console.error(err)
        return `./sticker/data.exif`
    })

}

exports.modStick = (BarBar, mek, media) => {
    out = getRandom('.webp')
    try {
        spawn('webpmux', ['-set','exif', './sticker/data.exif', media, '-o', out])
        .on('exit', () => {
            BarBar.sendMessage(mek.from, fs.readFileSync(out), 'stickerMessage', {quoted: mek})
            fs.unlinkSync(out)
            fs.unlinkSync(media)
        })
    } catch (e) {
        mek.reply("Terjadi kesalahan")
        fs.unlinkSync(media)
    }
}

exports.modMedia = (BarBar, mek, media) => {
    out = getRandom('.webp')
    try {
        ff(media)
        .on('error', (e) => {
            mek.reply("Terjadi kesalahan")
            fs.unlinkSync(media)
        })
        .on('end', () => {
            _out = getRandom('.webp')
            spawn('webpmux', ['-set','exif','./sticker/data.exif', out, '-o', _out])
            .on('exit', () => {
                BarBar.sendMessage(mek.from, fs.readFileSync(_out), 'stickerMessage', { quoted: mek })
                fs.unlinkSync(out)
                fs.unlinkSync(_out)
                fs.unlinkSync(media)
            })
        })
        .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
        .toFormat('webp')
        .save(out)
    } catch (e) {
        mek.reply("Terjadi kesalahan")
        fs.unlinkSync(media)
    }
}
