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
    const [openingHours, setOpeningHours] = useState([])
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
                <select name="tags" id="tags" multiple value={tags} onChange={(e) => {
                }}>
                    {
                        dbTags.map(tag => (
                            <option  
                                key={tag.id}
                                value={tag.name}>
                                    {tag.name}
                            </option>
                        ))
                    }
                </select>
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