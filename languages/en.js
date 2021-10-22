class en {

    /**
     * @param {String} prefix
    **/
    constructor(prefix) {
        if (!prefix) throw new Error("Unknown prefix : set prefix first")
        this.prefix = prefix
    }

    help(pushname) {
        return `Halo ${pushname}
Features available on this bot
        `.trim()
    }

    menuList() {
        return [
            {title: "Downloader", rows: [
                {
                    title: "TikTok",
                    description: "Download music/video from tiktok without watermark",
                    rowId: `${this.prefix}tiktok`
                },
                {
                    title: "YouTube Audio",
                    description: "Download music from YouTube",
                    rowId: `${this.prefix}yta`
                },
                {
                    title: "YouTube Video",
                    description: "Download video from YouTube",
                    rowId: `${this.prefix}ytv`
                },
                {
                    title: "Twitter",
                    description: "Download photo/video from twitter",
                    rowId: `${this.prefix}tweet`
                },
                {
                    title: "XnXx",
                    description: "Download video from xnxx",
                    rowId: `${this.prefix}xnxx`
                }
            ]},
            {title: "Stalker", rows: [
                {
                    title: "Instagram",
                    description: "Show someone's instagram profile info by username",
                    rowId: `${this.prefix}igstalk`
                },
                {
                    title: "Twitter",
                    description: "Show someone's twitter profile info by username",
                    rowId: `${this.prefix}twstalk`
                },
                {
                    title: "TikTok",
                    description: "Show someone's tiktok profile info by username",
                    rowId: `${this.prefix}ttstalk`
                }
            ]},
            {title: "Sticker", rows: [
                {
                    title: "Sticker",
                    description: "Convert photo to sticker",
                    rowId: `${this.prefix}s`
                },
                {
                    title: "Sticker Fire",
                    description: "Convert photo to sticker with effect burning fire",
                    rowId: `${this.prefix}sburn`
                },
                {
                    title: "Sticker Lightning",
                    description: "Convert photo to sticker with effect lightning",
                    rowId: `${this.prefix}slight`
                },
                {
                    title: "TtS",
                    description: "Convert text to sticker",
                    rowId: `${this.prefix}ttp`
                },
                {
                    title: "TtaS",
                    description: "Convert text to animated sticker",
                    rowId: `${this.prefix}attp`
                }
            ]}
        ]
    }

    err(cmd) {
        return {
            sticker: [`Send image with caption *${this.prefix+cmd}*`, `Example : *${this.prefix+cmd} text*`, "An error occurred"],
            deel: `Example : *${this.prefix+cmd} url*`,
            invalid: "Invalid url"
        }
    }

    res(res, type) {
        if (type === "tiktok") {
            return `👍 Likes : ${res.likes}\n🗯️ Comments : ${res.comments}\n↪️ Shares : ${res.shares}\n👀 Views : ${res.plays}\n🎶 ${res.music.title} (${res.music.author})\n👤 ${res.author.username} (${res.author.name})\n📃 ${res.description}`
        } else if (type === "youtube") {
            return `📍 Title : ${res.title}\n👍 Likes : ${res.likes}\n👎 Dislikes : ${res.dislikes}\n👀 Views : ${res.views}`
        }
    }

    footer() {
        return `Button not showing on your chat?
type this command
*${this.prefix}tikaud url* | for get music only from tiktok
*${this.prefix}tikvid url* | for get video only from tiktok
*${this.prefix}yta url* | for get music only from youtube
*${this.prefix}ytv url* | foe get video only from youtube`
    }
}

module.exports = en
