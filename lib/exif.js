const fs = require('fs')
const { tmpdir } = require("os")
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")
const path = require("path")

const generateHash = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.imageToWebp = async (media) => {
    if (!media.mimetype.includes("image")) throw new Error("media is not image")
    if (media.mimetype.includes("webp")) return media

    const stream = new (require("stream").Readable)()

    const tmpFile = path.join(
        tmpdir(),
        `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    )

    stream.push(media.data)
    stream.push(null)

    await new Promise((resolve, reject) => {
        ff(stream)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            ])
            .toFormat("webp")
            .save(tmpFile)
    })

    const buff = fs.readFileSync(tmpFile)
    fs.unlinkSync(tmpFile)
    return buff
}

exports.videoToWebp = async (media) => {
    if (!media.mimetype.includes("video")) throw new Error("media is not video")
    if (media.mimetype.includes("webp")) return media

    const stream = new (require("stream").Readable)()

    const tmpFile = path.join(
        tmpdir(),
        `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
    )

    stream.push(media.data)
    stream.push(null)

    await new Promise((resolve, reject) => {
        ff(stream)
            .on("error", reject)
            .on("end", () => resolve(true))
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat("webp")
            .save(tmpFile)
    })

    const buff = fs.readFileSync(tmpFile)
    fs.unlinkSync(tmpFile)
    return buff
}

exports.writeExif = async (media, metadata) => {
    let wMedia = toWebp(media)

    if (metadata.name || metadata.author) {
        const img = new webp.Image()
        const json = { "sticker-pack-id": generateHash(32), "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.loadBuffer(wMedia)
        img.exif = exif
        wMedia = await img.saveBuffer()
    }

    return wMedia
}
