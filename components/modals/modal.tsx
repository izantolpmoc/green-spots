import React, { ReactNode } from "react";
import styles from "@styles/components/modals/modal.module.scss"
import Button from "../button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Backdrop from "./backdrop";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

type Props = {
    onClose: () => void;
    children: ReactNode;
    className?: string;
    large?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    btnRight?: boolean;
    dark?: boolean;
    removePadding?: boolean;
    customHeader?: ReactNode;
    isForm?: boolean;
    onSwipeRight?: () => void;
    onSwipeLeft?: () => void;
}

const Modal = ({ onClose, children, large, fullWidth, fullHeight, btnRight, dark, removePadding, customHeader, className, onSwipeRight, onSwipeLeft, isForm }: Props) => {

    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (onSwipeRight) {
            onSwipeRight();
            }
        },
        onSwipedLeft: () => {
            if (onSwipeLeft) {
            onSwipeLeft();
            }
        },
    });
        
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
            y: "100vh",
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
        classNames += ' ' + (removePadding ? styles['removePadding'] : '')
        classNames += ' ' + (className ? className : '')
        return classNames
    }

    const getHeaderClassNames = () => {
        let classNames = styles.header
        classNames += ' ' + (btnRight ? styles['btnRight'] : '')
        return classNames
    }

    // render

    return (
        <Backdrop onClick={onClose}>
            <motion.dialog
                onClick={(e) => e.stopPropagation()}  
                className={getDialogClassNames()}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                {...handlers}
            >
            {
                customHeader ? 
                customHeader : 
                <div className={getHeaderClassNames()}>
                    <Button
                        onClick={onClose}
                        icon={faXmark}
                        action={btnRight ? "small" : "big"}
                        role={btnRight ? "secondary" : "tertiary"}
                        dark={dark}
                    />
                </div>
            }
            {
                isForm ?
                <form onSubmit={(e) => e.preventDefault()}>
                    {children}
                </form> : children
            }
            </motion.dialog>
        </Backdrop>
    );
};


export default Modal
