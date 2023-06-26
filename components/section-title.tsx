import styles from "@styles/components/section-title.module.scss"
import React from "react";

interface Props {
    children?: any;
    dark?: boolean;
}

const SectionTitle = ({ 
    children, dark
}: Props) => {

    const getClassNames = () => {
        let classNames = styles.container;
        if (dark) classNames += ` ${styles.dark}`;
        return classNames;
    }

    return ( 
        <div className={getClassNames()}>
            <hr/>
            <span>{children}</span>
            <hr/>
        </div>
    )
}

export default SectionTitle;
