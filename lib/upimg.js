const imgb = require('imgbb-uploader')

module.exports = (path) => new Promise(async (resolve, reject) => {
	const opt = {
		apiKey: 'baa46cea79544c4942a4b3d2d21be87c',
		imagePath: path,
		expiration: 3000
	}
	await imgb(opt)
		.then((res) => resolve(res))
		.catch((err) => reject(err))
})
