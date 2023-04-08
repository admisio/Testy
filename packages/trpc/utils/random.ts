export const randomOrder = (length: number): number[] => {
    const arr = new Array(length);
    for (let i = 0; i < length; i++) {
        arr[i] = i;
    }

    // Durstenfeld shuffle algorithm (Fisher-Yates)
    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
