import { getCoordinatesByAddress } from './open-street-map';
import * as fs from 'fs';

/// THIS CAN BE DELETED BUT KEEP IT FOR NOW CAN BE USEFUL LATER
fs.readFile('@json/spots.json', 'utf8', async (error, data) => {
    if (error) return 'nique zbi';

    try {
        const jsonFile = JSON.parse(data);

        const updateJson = async (jsonArray: any) => {
            const updatedArray = [];
            for (const json of jsonArray) {

                let adressFull = json.address + ' ' + json.city;

                const coordinates = await getCoordinatesByAddress(adressFull);

                if (coordinates) {
                    json.latitude = coordinates.latitude;
                    json.longitude = coordinates.longitude;
                }

                console.log(coordinates)

                updatedArray.push(json);
            }
            return updatedArray;
        }

        const updatedArray = await updateJson(jsonFile);
        const updatedJsonArray = JSON.stringify(updatedArray, null, 2);
        fs.writeFileSync('spotsUpdate.json', updatedJsonArray);
    } catch (e) {
        console.log(e)
    }
});