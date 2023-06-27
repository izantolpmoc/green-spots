import Button from "@components/button"
import SearchBar from "@components/form-elements/search-bar"
import SectionHeader from "@components/layout/section-header"
import SearchFiltersModal from "@components/modals/search-filters-modal"
import SectionTitle from "@components/section-title"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { Context } from "@lib/context"
import prisma from "@lib/prisma"

import styles from "@styles/pages/search.module.scss"
import { GetServerSideProps } from "next"
import { useContext, useEffect, useState } from "react"

interface Props {
    tags: string[];
}

const Search = (
    { tags }: Props
) => {

    // update the tags in the context

    const { setTags } = useContext(Context)

    useEffect(() => {
        setTags(tags)
    }, [])

    const { searchQuery, setSearchQuery } = useContext(Context)

    // manage search filters modal

    const [showSearchFiltersModal, setShowSearchFiltersModal] = useState(false)

    // trigger refresh of the search results when the search query changes

    const [refreshTrigger, setRefreshTrigger] = useState(false)

    const refresh = () => setRefreshTrigger(!refreshTrigger)

    // render

    return (
        <>
            <main id={styles.main}>
                <SectionHeader>
                    <SectionTitle>Recherche</SectionTitle>
                    <p>Trouver le spot qui vous convient !</p>
                </SectionHeader>
                <div className={styles.horizontalContainer}>
                    <SearchBar 
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => console.log(searchQuery)}
                    />
                    <Button
                        icon={faSliders}
                        onClick={() => setShowSearchFiltersModal(true)}
                    />
                </div>
            </main>
            <SearchFiltersModal
                showModal={showSearchFiltersModal}
                onClose={() => setShowSearchFiltersModal(false)}
                onSubmit={refresh}
            />
        </>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    

    // get all tags from the database using prisma

    const tags = (await prisma.tag.findMany({
        select: {
            name: true
        }
    })).map(tag => tag.name)

    // return the retrived tags

    return {
        props: {
            tags
        }
    }
    
}

export default Search