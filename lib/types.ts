import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { User } from "next-auth";


export interface NavItemType {
    name: string;
    icon: IconProp;
    path?: string;
    action?: () => void;
}

export interface SessionUser extends User {
    id: string;
    isModerator: boolean;
    isAdmin: boolean;
}


export interface Review {
    rating: number;
    comment?: string;
    createdAt: Date;
    user: User;
}

export interface Spot {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude:number;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    image: string;
    tags: {
        name: string;
        description: string;
    }[],
    reviews: Review[],
    likedBy: User[],
    openingHours: {
        openingTime: string;
        closingTime: string;
        startDate: string;
        endDate: string
    }[]
}