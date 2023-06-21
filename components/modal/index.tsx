import React, { ReactNode } from "react";
import styles from "@styles/components/modal.module.scss"
import Button from "../button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Backdrop from "./backdrop";
import { motion } from "framer-motion";

type Props = {
    onClose: () => void;
    children: ReactNode;
    title?: string;
    large?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    btnRight?: boolean;
    dark?: boolean;
}

const Modal = ({ onClose, children, title, large, fullWidth, fullHeight, btnRight, dark }: Props) => {

    const dropIn = {
        hidden: {
            y: "100vh",
            opacity: 0
        },
        visible: {
            y: "0",
            opacity: 1,
            transition: {
                duration: 0.6
            },
        },
        exit: {
            y: "0",
            opacity: 0,
            transition: {
                duration: 0.6
            }
        },
    };

    // dynamic classes

    const getDialogClassNames = () => {
        let classNames = styles.dialog
        classNames += ' ' + (large ? styles['large'] : '')
        classNames += ' ' + (fullWidth ? styles['fullWidth'] : '')
        classNames += ' ' + (fullHeight ? styles['fullHeight'] : '')
        classNames += ' ' + (dark ? styles['dark'] : '')
        return classNames
    }

    const getHeaderClassNames = () => {
        let classNames = styles.header
        classNames += ' ' + (btnRight ? styles['btnRight'] : '')
        return classNames
    }


    return (
        <Backdrop onClick={onClose}>
            <motion.dialog
                onClick={(e) => e.stopPropagation()}  
                className={getDialogClassNames()}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
            <div className={getHeaderClassNames()}>
                <Button
                    onClick={onClose}
                    icon={faXmark}
                    action="big"
                    role="tertiary"
                    dark={dark}
                />
            </div>
            {title && <h1>{title}</h1>}
            <div className={styles.body}>{children}</div>
            </motion.dialog>
        </Backdrop>
    );
};


export default Modal
