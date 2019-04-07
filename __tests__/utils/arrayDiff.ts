export default function arrayDiff<T>(arr1: T[], arr2: T[], callback: (v1: T, v2: T) => boolean): T[] {
    let result = [];
    arr1 = arr1 || [];
    arr2 = arr2 || [];
    for (let [index1, v1] of arr1.entries()) {
        let hasSame = false;
        for (let [index2, v2] of arr2.entries()) {
            if (callback(v1, v2)) {
                hasSame = true;
                arr2.splice(index2, 1);
            }
        }
        if (!hasSame) result.push(v1);
    }
    return [...result, ...arr2];
}