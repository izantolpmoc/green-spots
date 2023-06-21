/**
 * Input the adress (and city for better result) and get the coordinates
 * 
 * @async
 * @param {string} address
 * @returns {Promise<{ latitude: string, longitude: string } | null>}
 */
export const getCoordinatesByAddress = async (address: string): Promise<{ latitude: string, longitude: string } | null> => {

    const formattedAddress = encodeURIComponent(address);

    const apiUrl = `https://nominatim.openstreetmap.org/search?q=17+${formattedAddress}&format=json`;
  
    try {
        const response = await fetch(apiUrl)

        const data = await response.json()

        if (data.length) {

            const { lat, lon } = data[0];
        
            return { latitude: lat, longitude: lon };
        }

    } catch(e) {
        console.log(e)
    }
  
    return null;
}
  