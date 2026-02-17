export interface Comment {
    id?: number;
    userId: number;
    pinId: number;
    text: string;
    createdAt?: string;
    username?: string;
}

export interface Pin {
    id?: number;
    userId: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    imageUrl?: string;
    username?: string;
    createdAt?: string;
}

export interface User {
    id: number;
    username: string;
}
