const { WAConnection: _WAConnection, MessageType, WAConnectOptions, waChatKey, ProxyAgent } = require('@adiwajshing/baileys')
const { print } = require('./utils/col')
//const welkom = require('./lib/welcome')
const { getBuffer, banner, start, info, success, close } = require('./lib/functions')
//const { captcha } = require("./plugins/captcha")
const fs = require('fs')

/*
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional>
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

require('./BarBar')
nocache('./BarBar', meki => console.log(`"${meki}" Updated!`))
require('./lib/anu')
nocache('./lib/anu', meki => console.log(`"${meki}" Updated!`))
require("./utils/serializeMsg")
nocache("./utils/serializeMsg", meki => console.log(`"${meki} Update"`))

async function starts() {
	let WAConnection = require('./lib/anu')(_WAConnection)
	const client = new WAConnection()
	client.chatOrderingKey = waChatKey(true)
	client.connectOptions.maxRetries = Infinity
	client.logger.level = 'fatal'
	console.log(banner.string)
	client.on('qr', () => {
		print("[𓄵red|!𓄳] Scan the qr code on above")
	})
	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')// && client.once.loadAuthInfo('ses.json')

	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		if (!fs.existsSync('./BarBar.json')) {
			fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
		}
		success('2', 'Connected')
		print("[𓄵green|Dev𓄳] MhankBarBar")
		client.sendMessage(client.user.jid, 'Bot aktif um', MessageType.text)
	})
	client.on('close', async ({ reason, isReconnecting }) => {
		start('2',`Because ${reason} reconnecting : ${isReconnecting}`)
		if (!isReconnecting && reason == 'invalid_session') {
			print("[𓄵red|!𓄳] Session invalid, session file deleted")
			if (fs.existsSync('./BarBar.json')) {
				fs.unlinkSync('./BarBar.json')
			}
			client.clearAuthInfo()
		}
	})

	await client.connect({timeoutMs: 30*1000})
	fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

	client.on('group-participants-update', async (anu) => {
		try {
			const mdata = await client.groupMetadata(anu.jid)
			if (anu.action == 'add') {
				num = anu.participants[0]
				return
				//await captcha(client, num, mdata)
			} else if (anu.action == 'remove') {
				return
				/*num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Sayonara @${num.split('@')[0]}👋`
				client.sendImage(mdata.id, ppimg, teks, { contextInfo: {"mentionedJid": [num]} })*/
			}
		} catch (e) {
			print(`Err : 𓄵red|${e}𓄳`)
		}
	})

	client.on('chat-update', async (mek) => {
		if (mek.hasNewMessage && mek.messages) {
			mek = mek.messages.all()[0]
			if (!mek || !mek.message || mek.key && mek.key.remoteJid === "status@broadcast") return
			mek = require("./utils/serializeMsg")(client, mek)
			require('./BarBar')(client, mek)
		} else return 
	})

}
starts()
