import { faHeart, faHome, faMagnifyingGlass, faPlus, faUser } from "@fortawesome/free-solid-svg-icons"
import styles from "@styles/components/layout/nav-bar.module.scss"
import { useSession } from "next-auth/react";
import NavItem from "./nav-item";
import { NavItemType, SessionUser } from "@lib/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { set } from "zod";

const navItems: NavItemType[] = [
    {
        name: "Accueil",
        icon: faHome,
        path: "/app"
    },
    {
        name: "Recherche",
        icon: faMagnifyingGlass,
        path: "/app/search"
    },
    {
        name: "Ajouter un spot",
        icon: faPlus,
        action: () => console.log("add spot")
    },
    {
        name: "J'aimes",
        icon: faHeart,
        path: "/app/likes"
    },
    {
        name: "Mon compte",
        icon: faUser,
        action: () => console.log("account")
    }
]

const NavBar = () => {

    const router = useRouter()
    const user = useSession().data?.user as SessionUser | undefined

    const getInitialId = () => {
        const path = router.pathname
        const navItem = navItems.find(item => item.path === path)
        if (navItem) return navItems.indexOf(navItem)
        return 0
    }

    const [currentId, setCurrentId] = useState<number>(getInitialId())

    const handleClick = (item: NavItemType, id: number) => {
        if (item.action) item.action()
        else if(item.path) {
            setCurrentId(id)
            router.push(item.path)
        }
        // if (item.action) item.action()
        // else if (item.path) router.push(item.path)
    }


    // helpers

    const getNavItems = () => {
        // don't display the add spot button 
        // if the user is not a moderator or an admin
        if (!user?.isModerator &&!user?.isAdmin ) {
            return navItems.filter(item => item.name !== "Ajouter un spot")
        }
        return navItems
    }

    // render

    return (
        <nav id={styles.navBar}>
            <ul>
            {
                getNavItems().map((item: NavItemType, index: number) => (
                    <NavItem 
                        key={index} 
                        item={item} 
                        isCurrent={index === currentId}
                        onClick={() => handleClick(item, index) }
                    />
                ))
            }
            </ul>
        </nav>
    )
}

export default NavBar