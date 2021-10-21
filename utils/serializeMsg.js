const { MessageType } = require("@adiwajshing/baileys")

module.exports = serializeMsgObj = (client, mek) => {
    if (mek == undefined) return {}
    let mediaType = Object.values(MessageType).slice(9).slice(0,5)
    mek.id = mek.key.id
    mek.from = mek.key.remoteJid
    mek.fromMe = mek.key.fromMe
    mek.isGroup = mek.from.endsWith("@g.us")
    mek.sender = mek.isGroup ? mek.participant : mek.fromMe ? client.user.jid : mek.from
    mek.pushname = mek.fromMe ? client.user.name : client.getName(mek.sender)
    mek.timestamp = mek.messageTimestamp.low
    mek.type = Object.keys(mek.message)[0]
    mek.isMedia = mediaType.includes(mek.type)
    if (mek.isMedia) mek.getMedia = async () => await client.decryptMedia(mek)
    if (mek.isMedia) mek.mimetype = mek.message[mek.type].mimetype
    mek.quoted = mek.message.contextInfo ? mek.message.contextInfo.quotedMessage : mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.quotedMessage : false //mek.type === "buttonsResponseMessage" && mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.quotedMessage : mek.type === MessageType.extendedText && mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.quotedMessage : mek.message.contextInfo ? mek.message.contextInfo.quotedMessage : false
    mek.mentions = mek.message.contextInfo ? mek.message.contextInfo.mentionedJid : mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.mentionedJid : []
    if (mek.quoted) {
        let type = Object.keys(mek.quoted)[0]
        let quetod = mek.type === MessageType.extendedText && mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo : mek.message.contextInfo ? mek.message.contextInfo : false
        quetod.message = quetod.quotedMessage
        mek.quoted = mek.quoted[type]
        if (typeof mek.quoted === "string") mek.quoted = { text: mek.quoted }
        mek.quoted.type = type
        mek.quoted.id = mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.stanzaId : mek.message.contextInfo.stanzaId
        mek.quoted.from = mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.remoteJid || mek.from : mek.message.contextInfo.remoteJid || mek.from
        mek.quoted.sender = mek.message[mek.type].contextInfo ? mek.message[mek.type].contextInfo.participant || client.user.jid : mek.message.contextInfo.participant || client.user.jid
        mek.quoted.fromMe = mek.quoted.sender === (client.user && client.user.jid)
        mek.quoted.pushname = mek.quoted.fromMe ? client.user.name : client.getName(mek.quoted.sender)
        mek.quoted.body = type === MessageType.listMessage ? mek.quoted.description : type === MessageType.buttonsMessage ? mek.quoted.contentText : ["listResponseMessage"].includes(type) ? mek.quoted.singleSelectReply.selectedRowId : ["buttonsResponseMessage"].includes(type) ? mek.quoted.selectedButtonId : mek.quoted.caption || mek.quoted.conversation || mek.quoted.text || ""
        mek.quoted.isMedia = mediaType.includes(mek.quoted.type)
        if (mek.quoted.isMedia) mek.quoted.getMedia = () => client.decryptMedia(quetod)
        mek.quoted.mentions = mek.quoted.contextInfo ? mek.quoted.contextInfo.mentionedJid : []
        mek.quotedMsgObj = async () => {
            if(!mek.quoted.id) return false
            tot = await client.loadMessage(mek.quoted.from, mek.quoted.id)
            return serializeMsgObj(client, tot)
        }
        mek.quoted.reply = (text) => client.sendMessage(mek.quoted.from, text, MessageType.text, { quetod })
    }
    mek.body = mek.type === MessageType.listMessage ? mek.message[mek.type].description : mek.type === MessageType.buttonsMessage ? mek.message[mek.type].contentText : mek.type === "listResponseMessage" ? mek.message[mek.type].singleSelectReply.selectedRowId : mek.type === "buttonsResponseMessage" ? mek.message[mek.type].selectedButtonId : mek.type === "conversation" ? mek.message.conversation : mek.message[mek.type].text != undefined ? mek.message[mek.type].text : mek.isMedia ? mek.message[mek.type].caption : ""
    mek.reply = (text) => client.sendMessage(mek.from, text, MessageType.text, { quoted: mek })
    return mek
}
