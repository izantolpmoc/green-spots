import React, { ReactNode, MouseEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "@styles/components/modal.module.scss"
import Button from "./button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
    onClose: () => void;
    openModal: boolean;
    children: ReactNode;
    title?: string;
    large?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    btnRight?: boolean;
    dark?: boolean;
}

const Modal = ({ onClose, openModal, children, title, large, fullWidth, fullHeight, btnRight, dark }: Props) => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // This code runs after the component has been added to the DOM
        setMounted(true);
    }, []);

    const handleCloseClick = (e: MouseEvent) => {
        e.preventDefault();
        onClose();
    };

    // dynamic classes

    const getContentClassNames = () => {
        let classNames = styles.content
        classNames += ' ' + (large ? styles['large'] : '')
        classNames += ' ' + (fullWidth ? styles['fullWidth'] : '')
        classNames += ' ' + (fullHeight ? styles['fullHeight'] : '')
        classNames += ' ' + (dark ? styles['dark'] : '')
        classNames += ' ' + (openModal ? styles['open'] : '')
        return classNames
    }

    const getHeaderClassNames = () => {
        let classNames = styles.header
        classNames += ' ' + (btnRight ? styles['btnRight'] : '')
        return classNames
    }

    const getOverlayClassNames = () => {
        let classNames = styles.overlay
        classNames += ' ' + (openModal ? styles['open'] : '')
        return classNames
    }

    const getWrappperClassNames = () => {
        let classNames = styles.wrapper
        classNames += ' ' + (openModal ? styles['open'] : '')
        return classNames
    }

    // modal 

    const modalContent = (
        <div className={getOverlayClassNames()}>
            <div className={getWrappperClassNames()}>
                <dialog open className={getContentClassNames()}>
                    <div className={getHeaderClassNames()}>
                        <Button
                            onClick={handleCloseClick}
                            icon={faXmark}
                            action="big"
                            role="tertiary"
                            dark={dark}
                        />
                    </div>
                    {title && <h1>{title}</h1>}
                    <div className={styles.body}>{children}</div>
                </dialog>
            </div>
        </div>
    );

    // waits for DOM to be rendered before selecting root div
    return mounted && ReactDOM.createPortal(
        modalContent,
        document.getElementById("modal-root") as Element
    );
};

export default Modal
