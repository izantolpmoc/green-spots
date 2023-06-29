import styles from "@styles/components/section-title.module.scss"
import React from "react";

interface Props {
    className?: string;
    children?: any;
    small?: boolean;
    dark?: boolean;
}

const SectionTitle = ({ 
    children, small, dark, className
}: Props) => {

    // utils

    const getClassNames = () => {
        let classNames = styles.container;
        classNames += (className ? ' ' + className : '')
        classNames += (small ? ' ' + styles.small : '')
        classNames += (dark ? ' ' + styles.dark : '')
        return classNames;
    }
    // render

    return ( 
        <div className={getClassNames()}>
            <hr/>
            <span>{children}</span>
            <hr/>
        </div>
    )
}

export default SectionTitle;
