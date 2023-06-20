import cloudinary from 'cloudinary'

export const cloudinaryV2 = cloudinary.v2
export const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}

export const uploadImage = async (base64: string) => {  

    cloudinaryV2.config(cloudinaryConfig)

    const uploadDir = 'spots/'

    const imageConfig = {
            quality: 100,
            folder: uploadDir,
    }
    
    const result = await cloudinaryV2.uploader.upload(base64, imageConfig)
    
    return result;
}

export const deleteImage = async (public_id: string) => {

    cloudinaryV2.config(cloudinaryConfig)

    // @ts-ignore
    const response = await cloudinaryV2.api.delete_resources(public_id).then(console.log)

    return response;
}
