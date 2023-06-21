import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavItemType } from "@lib/types"

import styles from "@styles/components/layout/nav-item.module.scss"

interface Props {
    item: NavItemType
    isCurrent?: boolean
    onClick: () => void
}

const NavItem = (
    {
        item,
        isCurrent,
        onClick
    }: Props
) => {


    const getClassNames = () => {
        let classNames = styles.navItem
        classNames += isCurrent ? ` ${styles.current}` : ""
        return classNames
    }

    // render

    return (
        <li 
            onClick={onClick}
            className={getClassNames()}>
            <FontAwesomeIcon icon={item.icon} />
            {
                isCurrent ?
                <FontAwesomeIcon icon={faCircle} width="4" height="4" />
                :
                <></>
            }
        </li>
    )
}

export default NavItem