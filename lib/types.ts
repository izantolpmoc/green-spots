
// see schema.prisma for the Tag model

export interface TagCreate {
    name: string;
    description: string;
}


// see schema.prisma for the OpeningHours model

export interface OpeningHoursCreate {
    openingTime: string;
    closingTime: string;
    startDate: string;
    endDate: string;
}


// see schema.prisma for the Review model

export interface ReviewCreate {
    comment: string;
    rating: number;
}

// see schema.prisma for the Spot model

export interface SpotCreate {
    name: string;
    description: string;
    image: string;
    latitude: number;
    longitude: number;
    tags: string[];
    openingHours: OpeningHoursCreate[];
}

