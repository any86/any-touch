const cache = {};
export default function(url) {
    return new Promise((resolve, reject) => {
        if (cache[url]) {
            resolve(cache[url]);
            return;
        }

        const img = new Image();
        img.onload = () => {
            cache[url] = img;
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
    });
}