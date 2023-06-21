const apiKey = process.env.IMAGGA_APIKEY as string;
const apiSecret = process.env.IMAGGA_APISECRET as string;
const apiUrl = process.env.IMAGGA_APIURL as string;

/**
 * analyse if the image can be validated
 * @date 21/06/2023 - 09:57:31
 *
 * @async
 * @param {string} uri
 * @returns {function execute}
 */
export const validateImage = async (uri: string) => {

    const url = apiUrl + "?image_url=" + encodeURIComponent(uri);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + apiSecret).toString('base64'),
            }
        })

        const data = await response.json();

        if(!data.result) {
            return false;
        }

        return await checkTags(data.result.tags);
    } catch (error) {
        console.log(error);
    }
};

/**
 * Check via tags if the image is valid or not
 * @date 21/06/2023 - 09:57:31
 *
 * @param {string[]} tags
 * @returns {true/false}
 */
const checkTags = (tags: string[]) => {
    const validTags = [
        "forest",
        "park",
        "tree",
        "trees",
        "nature",
        "outdoors",
        "woods",
        "wood",
        "plant",
        "leaf",
        "environment",
        "landscape",
        "scenic",
        "rural",
        "wilderness",
        "scenery",
        "mountain",
        "sky",
        "grass",
        "summer",
        "travel",
        "woody plant",
        "season",
        "sun",
        "autumn",
        "sunlight"
    ];

    return tags.some((tag: any) => validTags.includes(tag.tag.en) && tag.confidence > 60);
}