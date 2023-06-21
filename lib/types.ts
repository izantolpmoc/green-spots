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