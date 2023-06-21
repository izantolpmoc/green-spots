import Button from "@components/button"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import styles from "@styles/components/layout/header.module.scss"

const Header = () => {


    // render

    return (
        <header id={styles.header}>
            <div>
                <img src="/favicon/favicon.svg" alt="favicon" />
                <h1>GREEN SPOTS</h1>
            </div>
        </header>
    )
}

export default Header