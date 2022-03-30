export default (time=100) => new Promise<void>((resolve, reject) => {
    try {
        setTimeout(() => {
            resolve();
        }, time);
    } catch (error) {
        reject(error);
    }
});