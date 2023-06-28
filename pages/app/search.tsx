import Button from "@components/button"
import SearchBar from "@components/form-elements/search-bar"
import DynamicSpotsGrid from "@components/layout/dynamic-spots-grid"
import ScrollUpIndicator from "@components/layout/scroll-indicator"
import SectionHeader from "@components/layout/section-header"
import SearchFiltersModal from "@components/modals/search-filters-modal"
import SectionTitle from "@components/section-title"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { Context } from "@lib/context"
import prisma from "@lib/prisma"
import { Spot } from "@lib/types"

import styles from "@styles/pages/search.module.scss"
import { AnimatePresence } from "framer-motion"
import { GetServerSideProps } from "next"
import { use, useContext, useEffect, useRef, useState } from "react"

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

    const { 
        userLocation,
        searchQuery, 
        setSearchQuery,
        selectedTags,
        maxDistance
    } = useContext(Context)

    // manage search filters modal

    const [showSearchFiltersModal, setShowSearchFiltersModal] = useState(false)

    // trigger refresh of the search results when the search query changes

    const [refreshTrigger, setRefreshTrigger] = useState(false)
    const refresh = () => setRefreshTrigger(!refreshTrigger)

    // get the search results, initially & when a refresh is triggered

    const [searchResults, setSearchResults] = useState<Spot[]>([])

    const buildSearchParams = () => {
        let searchParamsObj: any = {}
        if(userLocation) {
            searchParamsObj = {
                maxDistance,
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude
            }
        }
        if(searchQuery) searchParamsObj["query"] = searchQuery
        if(selectedTags.length > 0) searchParamsObj["tags"] = selectedTags
        return searchParamsObj
    }

    const getSearchResults = async () => {
        return await fetch("/api/spots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buildSearchParams())
        }).then(res => res.json()).then(data => data.spots) as Spot[]
    }

    useEffect(() => {
        getSearchResults().then(results => setSearchResults(results))
    }, [refreshTrigger, userLocation])


    // manage scroll

    const containerRef = useRef<HTMLElement>(null)

    const [isScrolledToTop, setIsScrolledToTop] = useState(false)

    useEffect(() => {
        if (!containerRef.current) return;
		
		const container = containerRef.current;
	  
		// add an event listener to check
		// if the main is scrolled to the top

		const getIsScrolledToTop = () => container.scrollTop == 0;
	  
		const handleScroll = () => {
		  setIsScrolledToTop(getIsScrolledToTop());
		};
	  
		// initial check
		handleScroll();

		// add the event listener
		container.addEventListener('scroll', handleScroll);
	  
		// clean up
		return () => {
		  container.removeEventListener('scroll', handleScroll);
		};
	}, [containerRef.current]);


    // handle scroll up indicator click

    const scrollToTop = () => {
        if(!containerRef.current) return
        containerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // render

    return (
        <>
            <main
                ref={containerRef} 
                id={styles.main}>
                <SectionHeader>
                    <SectionTitle>Recherche</SectionTitle>
                    <p>Trouver le spot qui vous convient !</p>
                </SectionHeader>
                <div className={styles.horizontalContainer} id="search-bar-container">
                    <SearchBar 
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={refresh}
                    />
                    <Button
                        icon={faSliders}
                        onClick={() => setShowSearchFiltersModal(true)}
                    />
                </div>
                <DynamicSpotsGrid spots={searchResults} />
                <AnimatePresence
                    initial={false}
                    mode='wait'
                    onExitComplete={() => null}>
                {
                    !isScrolledToTop &&
                    <ScrollUpIndicator onClick={scrollToTop} />
                }
                </AnimatePresence>
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