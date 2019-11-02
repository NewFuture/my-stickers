export interface Sticker {
    src: string;
    id: string | number;
    name?: string;
}

export function getStickers(): Sticker[] {
    return Array(12)
        .fill(0)
        .map((n, i) => ({
            id: i,
            src: `https://cataas.com/cat/gif?${i}`,
            name: i % 3 ? `s-${i}` : undefined,
        }));
}