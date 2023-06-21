'use strict';

import * as fs from 'fs'
import { z } from 'zod'

const spotListSchema = z.array(z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(240).optional(),
    // geolocation
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    // full address
    address: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    region: z.string().min(1).max(255),
    postalCode: z.string().min(1).max(255),
    country: z.string().min(1).max(255).optional(),
    // other
    website: z.string().url().optional(),
    tags: z.array(z.string()),
    openingHours: z.array(z.object({
        openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }))
}))

const postSpots = () => {

    let rawData: any[] = JSON.parse(fs.readFileSync('json/spots.json', 'utf8')).map((spot: any) => ({
        ...spot,
        description: spot.description.substring(0, 240)
    }))

    // validate the data from the JSON file

    let spots = spotListSchema.safeParse(rawData)

    if(!spots.success) {
        const { errors } = spots.error
        console.log(errors)
        return
    }

    // POST each spot to the /api/spots/create endpoint

    spots.data.forEach(async spot => {
        await fetch('http://localhost:3000/api/spots/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spot)
        }).then(data => {
            // if the response is not 200, log only the error message
            if(data.status !== 200) {
                console.log("problem with spot: " + spot.name)
            }
        })
    })

}

postSpots()