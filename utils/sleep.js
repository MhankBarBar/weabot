const sleep = (dur) => {
    var now = new Date().getTime();
    while(new Date().getTime() < now + dur * 1000){ /* Do nothing */ }
}

module.exports = { sleep }
