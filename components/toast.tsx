import { AnimatePresence, motion } from "framer-motion";

import styles from "@styles/components/toast.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
    error?: boolean;
    showToast: boolean;
    onHide: () => void;
}

const Toast = (
    {
        children,
        error,
        showToast,
        onHide
    }: Props
) => {

    // style utils

    const getToastClassNames = () => {
        let classNames = styles.toast
        classNames += ' ' + (error ? styles['error'] : '')
        return classNames
    }

    const getIcon = () => {
        return error ? faTimes : faCheck
    }

    // close the toast after 2 seconds

    useEffect(() => {
        if(showToast) {
            setTimeout(() => onHide(), 2000)
        }
    }, [showToast])


    // render

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}>
            {
                showToast ?
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={getToastClassNames()}>
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={getIcon()} />
                        </div>
                        <span>
                            {children}
                        </span>
                </motion.div>
                :
                <></>
            }
        </AnimatePresence>
    )
}

export default Toast