
import styles from '@styles/components/layout/section-header.module.scss'

interface Props {
    children?: React.ReactNode
}

const SectionHeader = (
    { children }: Props
) => {

    // render

    return (

        <div className={styles.sectionHeader}>
            { children }
        </div>

    )

}

export default SectionHeader