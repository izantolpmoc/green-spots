import styles from "@styles/components/section-title.module.scss"
import React from "react";

interface Props {
    children; any;
    instance: "desktop" | "mobile";
}

const SectionTitle = ({ 
    children,
    instance,
}: Props) => {

    const getClassNames = () => {
        let classNames = `${styles["section-title"]} ${instance === "desktop" ? styles.desktop : styles.mobile}`;
        return classNames;
    }

    return ( 
        <div className={getClassNames()}>
            <div className={styles.line}/>
            <p className={styles.title}>{children}</p>
            <div className={styles.line}/>
        </div>
    )
}

export default SectionTitle;
