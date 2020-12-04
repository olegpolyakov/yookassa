function delay(ms) {
    return new Promise(resolve => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            resolve();
        }, ms);
    });
}

module.exports = {
    delay
};