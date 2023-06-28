/**
 * Get the distance from a spot to a given latitude and longitude in kilometers.
 * 
 * @param {number} lat The latitude of the spot to get the distance from
 * @param {number} lon The longitude of the spot to get the distance from
 * @param {number} spotLatitude The latitude of the point to get the distance to
 * @param {number} spotLongitude The longitude of the point to get the distance to
 * 
 * @returns {number} The distance in kilometers between the spot and the given point
 */
export const getDistanceFromLatLonInKm = (lat: number, lon: number, spotLatitude: number, spotLongitude: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(spotLatitude - lat);
    const dLon = deg2rad(spotLongitude - lon);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat)) * Math.cos(deg2rad(spotLatitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2); // Round the result to 2 decimal places
}

/**
 * Convert degree to radian
 * 
 * @param {number} deg The degree to be converted
 * 
 * @returns {number} The converted value in radian
 */
const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
}