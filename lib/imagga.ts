const apiKey = process.env.IMAGGA_APIKEY as string;
const apiSecret = process.env.IMAGGA_APISECRET as string;

const imageUrl = 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg';
const url = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(imageUrl);

const getTagsFromImage = async () => {
    try {
        const response = await fetch(url, {
            headers: {
                'username': apiKey,
                'password': apiSecret
            }
        });

        console.log(response.body);
    } catch (error) {
        console.log(error);
    }
};

getTagsFromImage();