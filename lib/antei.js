const {
    get,
    post
} = require("axios")

/**
 * @class anteiku
**/
class anteiku {

    /**
     * @param {String} apikey (get on antei.codes)
    **/
    constructor(apikey) {
        if (!apikey) throw new Error("Unknown apikey : apikey is missing")
        if (typeof apikey !== "string") throw new SyntaxError("Invalid apikey : apikey must be a string")
        this.apikey = apikey
        this.baseUrl = "https://antei.codes"
    }

    /**
     * Get json response from api antei.codes (Downloader)
     * @param {String} endpoint - name of the endpoint
     * @param {Object} data - Object to send data
    **/
    async downloader(endpoint, data={}) {
        if (!endpoint) throw new Error("Missing endpoint")

        try {
            let deel = await get(`${this.baseUrl}/${endpoint}`, {
                params: data,
                headers: {
                    "Authorization": this.apikey
                }
            })
            return deel.data
        } catch (e) {
            throw e
        }
    }

    /**
     * Get buffer response from api antei.codes (Image random / Generator)
     * @param {String} endpoint - name of the endpoint
     * @param {Object} data - Object to send data
    **/
    async images(endpoint, data={}) {
        if (!endpoint) throw new Error("Missing endpoint")

        try {
            let deel = await get(`${this.baseUrl}/${endpoint}`, {
                params: data,
                responseType: "arraybuffer",
                headers: {
                    "Authorization": this.apikey
                }
            })
            return deel.data
        } catch (e) {
            throw e
        }
    }
}

module.exports = anteiku
