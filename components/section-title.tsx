import styles from "@styles/components/section-title.module.scss"
import React from "react";

interface Props {
    title: string;
    instance: "desktop" | "mobile";
}

const SectionTitle = ({ 
    title,
    instance,
}: Props) => {

    const getClassNames = () => {
        let classNames = `${styles["section-title"]} ${instance === "desktop" ? styles.desktop : styles.mobile}`;
        return classNames;
    }

    return ( 
        <div className={getClassNames()}>
            <div className={styles.line}/>
            <p className={styles.title}>{title}</p>
            <div className={styles.line}/>
        </div>
    )
}

export default SectionTitle;
