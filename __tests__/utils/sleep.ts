export default (time=100) => new Promise((resolve, reject) => {
    try {
        setTimeout(() => {
            resolve();
        }, time);
    } catch (error) {
        reject(error);
    }
});