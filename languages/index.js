class ind {

    /**
     * @param {String} prefix
    **/
    constructor(prefix) {
        if (!prefix) throw new Error("Unknown prefix : set prefix first")
        this.prefix = prefix
    }

    help(pushname) {
        return `Halo ${pushname}
Fitur yang tersedia pada bot ini
        `.trim()
    }

    menuList() {
        return [
            {title: "Downloader", rows: [
                {
                    title: "TikTok",
                    description: "Mengunduh video dari tiktok tanpa watermark",
                    rowId: `${this.prefix}tiktok`
                },
                {
                    title: "YouTube Audio",
                    description: "Mengunduh audio dari YouTube",
                    rowId: `${this.prefix}yta`
                },
                {
                    title: "YouTube Video",
                    description: "Mengunduh video dari YouTube",
                    rowId: `${this.prefix}ytv`
                },
                {
                    title: "Twitter",
                    description: "Mengunduh foto/video dari twitter",
                    rowId: `${this.prefix}tweet`
                },
                {
                    title: "XnXx",
                    description: "Mengunduh video dari xnxx",
                    rowId: `${this.prefix}xnxx`
                }
            ]},
            {title: "Stalker", rows: [
                {
                    title: "Instagram",
                    description: "Menampilkan profile instagram seseorang berdasarkan nama pengguna",
                    rowId: `${this.prefix}igstalk`
                },
                {
                    title: "Twitter",
                    description: "Menampilkan profile twitter seseorang berdasarkan nama pengguna",
                    rowId: `${this.prefix}twstalk`
                },
                {
                    title: "TikTok",
                    description: "Menampilkan profile tiktok seseorang berdasarkan nama pengguna",
                    rowId: `${this.prefix}ttstalk`
                }
            ]},
            {title: "Sticker", rows: [
                {
                    title: "Stiker",
                    description: "Mengubah foto menjadi sticker",
                    rowId: `${this.prefix}s`
                },
                {
                    title: "Stiker Api",
                    description: "Mengubah foto menjadi sticker dengan efek terbakar api",
                    rowId: `${this.prefix}sburn`
                },
                {
                    title: "Stiker Petir",
                    description: "Mengubah foto menjadi sticker dengan efek sambaran petir",
                    rowId: `${this.prefix}slight`
                }
            ]}
        ]
    }
}

module.exports = { ind }
