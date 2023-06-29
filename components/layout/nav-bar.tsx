import { faHeart, faHome, faMagnifyingGlass, faPlus, faUser } from "@fortawesome/free-solid-svg-icons"
import styles from "@styles/components/layout/nav-bar.module.scss"
import { useSession } from "next-auth/react";
import NavItem from "./nav-item";
import { NavItemType, SessionUser } from "@lib/types";
import { useRouter } from "next/router";
import { useState } from "react";
import LoginModal from "@components/modals/login-modal";
import MyAccountModal from "@components/modals/my-account-modal";
import AddSpotModal from "@components/modals/add-spot-modal";

const NavBar = () => {

    const router = useRouter()
    const { data: session, status } = useSession()
    const user = session?.user as SessionUser | undefined

    // data

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
            action: () => setShowAddSpotModal(!showAddSpotModal)
        },
        {
            name: "J'aimes",
            icon: faHeart,
            path: "/app/likes"
        },
        {
            name: "Mon compte",
            icon: faUser,
            action: () => setShowAccountModal(!showAccountModal)
        }
    ]

    // state

    const getInitialId = () => {
        const path = router.pathname
        const navItem = navItems.find(item => item.path === path)
        if (navItem) return navItems.indexOf(navItem)
        return 0
    }


    const [currentId, setCurrentId] = useState<number>(getInitialId())
    const [prevCurrentId, setPrevCurrentId] = useState<number>(currentId)
    const [showAccountModal, setShowAccountModal] = useState<boolean>(false)
    const [showAddSpotModal, setShowAddSpotModal] = useState<boolean>(false)
    

    // utils

    const getNavItems = () => {
        // don't display the add spot button 
        // if the user is not a moderator or an admin
        if (!user?.isModerator &&!user?.isAdmin ) {
            return navItems.filter(item => item.name !== "Ajouter un spot")
        }
        return navItems
    }


    // handlers

    const handleClick = (item: NavItemType, id: number) => {
        if (item.action) item.action()
        else if(item.path) router.push(item.path)
        setPrevCurrentId(currentId)
        setCurrentId(id)
    }

    const handlerAccountModalClose = () => {
        setShowAccountModal(false)
        setCurrentId(prevCurrentId)
    }

    const handlerAddSpotClose = () => {
        setShowAddSpotModal(false)
        setCurrentId(prevCurrentId)
    }

    // render

    return (
        <>
        
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
            {
                status === "authenticated" ?
                <MyAccountModal showModal={showAccountModal} onClose={handlerAccountModalClose}/>
                :
                <LoginModal showModal={showAccountModal} onClose={handlerAccountModalClose}/>
            }

            <AddSpotModal showModal={showAddSpotModal} onClose={handlerAddSpotClose} />
        </>
    )
}

export default NavBar