import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


import styles from "@styles/components/layout/scroll-up-indicator.module.scss"
import { motion } from "framer-motion"

interface Props {
    onClick?: () => void;
}

const ScrollUpIndicator = (
    { onClick }: Props
) => {

    // animation

    const dropIn = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.6
            }
        },
    }

    // render

    return (
        <motion.button
            onClick={onClick} 
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={styles.scrollDownIndicator}>
            <FontAwesomeIcon icon={faArrowUp} />
        </motion.button>
    )

}

export default ScrollUpIndicator