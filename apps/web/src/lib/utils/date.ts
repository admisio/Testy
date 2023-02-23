export const formatDate = (date: Date | null): string | null => {
    if (!date) return null;
    return (
        date.getDay() +
        '. ' +
        date.getMonth() +
        '. ' +
        date.getFullYear() +
        ' ' +
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
    );
};

export const formatTime = (date: Date | null): string | null => {
    if (!date) return null;
    return (
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
    );
};

export const remainingTime = (date: Date | null): string | null => {
    if (!date) return null;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
