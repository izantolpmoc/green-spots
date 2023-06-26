import { motion } from "framer-motion";
import { ReactNode } from "react";

import styles from "@styles/components/modals/backdrop.module.scss"

type Props = {
    onClick: () => void;
    children: ReactNode
}

const Backdrop = ({ children, onClick } :Props) => {

    return (
        <motion.div
            onClick={onClick}
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    );
};

export default Backdrop;