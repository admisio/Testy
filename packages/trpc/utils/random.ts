export const randomOrder = (length: number): number[] => {
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
        arr[i] = i;
    }
    for (let i = 0; i < length; i++) {
        const j = Math.floor(Math.random() * length);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};