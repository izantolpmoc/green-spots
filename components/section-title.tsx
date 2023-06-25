import styles from "@styles/components/section-title.module.scss"
import React from "react";

interface Props {
    children?: any;
}

const SectionTitle = ({ 
    children
}: Props) => {

    return ( 
        <div className={styles.container}>
            <hr/>
            <span>{children}</span>
            <hr/>
        </div>
    )
}

export default SectionTitle;
