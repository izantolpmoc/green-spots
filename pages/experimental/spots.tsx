import prisma from "@lib/prisma"
import { Tag } from "@prisma/client"
import { useState } from "react"

interface Props {
    dbTags: Tag[] 
}

const Spots = (
    { dbTags }: Props
) => {



    // render

    // create all the states for the form

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [tags, setTags] = useState<string[]>([])
    const [openingHours, setOpeningHours] = useState<any[]>([])
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [openingTime, setOpeningTime] = useState("")
    const [closingTime, setClosingTime] = useState("")

    // render

    return (
        <main>
            <form
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                }}
            >
                <label htmlFor="name">Nom</label>
                <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <label htmlFor="image">Image</label>
                <input type="text" id="image" name="image" value={image} onChange={(e) => setImage(e.target.value)} />
                <label htmlFor="latitude">Latitude</label>
                <input type="number" id="latitude" name="latitude" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))} />
                <label htmlFor="longitude">Longitude</label>
                <input type="number" id="longitude" name="longitude" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))} />
                <label htmlFor="tags">Tags</label>
                {/* @ts-ignore */}
                <select name="tags" id="tags" multiple value={tags}>
                    {
                        dbTags.map(tag => (
                            <option  
                                key={tag.id}
                                value={tag.name}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setTags(currentTags => {
                                        if (currentTags.includes(tag.name)) {
                                            return currentTags.filter(currentTag => currentTag !== tag.name)
                                        } else {
                                            return [...currentTags, tag.name]
                                        }
                                    })
                                }}>
                                    {tag.name}
                            </option>
                        ))
                    }
                </select>
                <label htmlFor="openingHours">Horaires</label>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                        }}
                    >
                        <label htmlFor="startDate">Date de début</label>
                        <input type="date" id="startDate" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <label htmlFor="endDate">Date de fin</label>
                        <input type="date" id="endDate" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                        }}
                    >
                        <label htmlFor="openingTime">Heure d&apos;ouverture</label>
                        <input type="time" id="openingTime" name="openingTime" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                        <label htmlFor="closingTime">Heure de fermeture</label>
                        <input type="time" id="closingTime" name="closingTime" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setOpeningHours(currentOpeningHours => {
                                return [...currentOpeningHours, {
                                    startDate,
                                    endDate,
                                    openingTime,
                                    closingTime
                                }]
                            })
                        }}
                        type="button"
                    >
                        Ajouter
                    </button>
                </div>
                <button 
                    onClick={(e) => {
                        e.preventDefault()
                        let body = {
                            name,
                            description,
                            image,
                            latitude,
                            longitude,
                            tags,
                            openingHours
                        }
                        console.log(body)
                        // post the form
                        fetch("/api/spots/create", {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify(body)
                        }).then(res => res.json()).then(res => {
                            console.log(res)
                        })
                    }}
                    type="button">Créer</button>
            </form>
        </main>
    )

}

// get the tags from prisma in getServerSideProps

export const getServerSideProps = async () => {
    return {
        props: {
            dbTags: await prisma.tag.findMany()
        }
    }
}

export default Spots