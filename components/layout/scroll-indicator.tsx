import styles from "@styles/components/layout/scroll-up-indicator.module.scss"
import { motion } from "framer-motion"

interface Props {
    mode?: "up" | "down" | "left" | "right";
    children: React.ReactNode;
    onClick?: () => void;
}

const ScrollIndicator = (
    { 
        mode,
        children,
        onClick    
    }: Props
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

    const getClassNames = () => {
        let classNames = styles.scrollIndicator + " "
        classNames += mode ? styles[mode] : styles.up
        return classNames
    }


    // render

    return (
        <motion.button
            onClick={onClick} 
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={getClassNames()}>
            { children }
        </motion.button>
    )

}

export default ScrollIndicator