module.exports = serializeMe = (client, mek) => {
    if (mek == undefined) return null
    mek.imgUrl = client.getProfilePicture(mek.jid)
    client.getStatus(mek.jid).then(x => {
        mek.status = x.status
    })
    return mek
}
