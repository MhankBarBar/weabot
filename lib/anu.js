const fs = require('fs')
const path = require('path')
const FileType = require('file-type')
const { getBuffer, getRandom } = require('./functions')
const { MessageType } = require('@adiwajshing/baileys')
const { imageToWebp, videoToWebp, writeExif } = require("./exif")

module.exports = WAConnection = (_wea) => {
    class WAConnection extends _wea {
        constructor(...args) {
            super(...args)

            this.on('CB:action,,battery', json => {
                this.battery = json[2][0][1]
            })
        }

        async getGroupAdmins(groupId) {
            let groupMeta = await this.groupMetadata(groupId)
            let admins = []
            groupMeta.participants.forEach((x) => {
                x.isAdmin ? admins.push(x.jid) : ''
            })
            return admins
        }

        getName(jid) {
            return this.contacts[jid] != undefined ? this.contacts[jid].vname || this.contacts[jid].notify || this.contacts[jid].name : undefined
        }

        reply(jid, text, quoted, options) {
            return this.sendMessage(jid, text, MessageType.text, { quoted, ...options })
        }

        sendText(jid, text) {
            return this.sendMessage(jid, text, MessageType.text)
        }

        sendListMsg(jid, text, btext, lists = [], quoted, options) {
            let lstMsg = {
                buttonText: btext,
                description: text,
                sections: lists,
                listType: 1
            }
            return this.sendMessage(jid, lstMsg, MessageType.listMessage, { quoted, ...options })
        }

        sendButtons(jid, text, buttons = [], footer = "@MhankBarBar", quoted, options) {
            let btn = []
            buttons.forEach(x => {
                btn.push({buttonId: x.id, buttonText: { displayText: x.text }, type: 1})
            })
            let btnMsg = {
                contentText: text,
                footerText: footer,
                buttons: btn,
                headerType: 1
            }
            return this.sendMessage(jid, btnMsg, MessageType.buttonsMessage, { quoted, ...options })
        }

        async sendButtonsImage(jid, text, path, buttons = [], footer = "@MhankBarBar", quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let img = await this.prepareMessage(jid, buff, MessageType.image)
            let btn = []
            buttons.forEach(x => {
                btn.push({buttonId: x.id, buttonText: { displayText: x.text }, type:1})
            })
            let btnMsg = {
                contentText: text,
                footerText: footer,
                buttons: btn,
                headerType: 4,
                imageMessage: img.message.imageMessage
            }
            return this.sendMessage(jid, btnMsg, MessageType.buttonsMessage, { quoted, ...options })
        }

        async sendButtonsVideo(jid, text, path, buttons = [], footer = "@MhankBarBar", quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let vid = await this.prepareMessage(jid, buff, MessageType.video)
            let btn = []
            buttons.forEach(x => {
                btn.push({buttonId: x.id, buttonText: { displayText: x.text }, type: 1})
            })
            let btnMsg = {
                contentText: text,
                footerText: footer,
                buttons: btn,
                headerType: 5,
                videoMessage: vid.message.videoMessage
            }
            return this.sendMessage(jid, btnMsg, MessageType.buttonsMessage, { quoted, ...options })
        }

        sendTextWithMentions(jid, text, quoted) {
            return this.sendMessage(jid, text, MessageType.extendedText, { quoted, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net')}})
        }

        async sendImage(jid, path, caption = '', quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            return await this.sendMessage(jid, buff, MessageType.image, { quoted, caption: caption, ...options })
        }

        async sendImageAsSticker(mek, path, quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            let media = {}
            let buffer
            media.data = buff
            media.mimetype = FileType(buff).mime
            if (options && (options.packname || options.author)) {
                buffer = await writeExif(media, options)
            } else {
                buffer = media.mimetype.includes("image") ? await imageToWebp(media) : media.mimetype.includes("video") ? await videoToWebp(media) : ""
            }
            return await this.sendMessage(mek.from, buffer, MessageType.sticker, { quoted, ...options })
        }

        async sendAudio(jid, path, filename = '', quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            return await this.sendMessage(jid, buff, MessageType.audio, { quoted, mimetype: 'audio/mp4', ...options })
        }

        async sendPtt(jid, path, quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            return await this.sendMessage(jid, buff, MessageType.audio, { quoted, mimetype: 'audio/mp4', ptt: true, ...options })
        }

        async sendVideo(jid, path, caption = "", quoted, options) {
            let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
            return await this.sendMessage(jid, buff, MessageType.video, { quoted, caption: caption, mimetype: 'video/mp4', ...options })
        }

        async decryptMedia(mek) {
            if (!mek || !mek.message) return Buffer.alloc(0)
            if (!mek.message[Object.keys(mek.message)[0]].url) await this.updateMediaMessage(mek)
            return await this.downloadMediaMessage(mek)
        }
    }
    return WAConnection
}
