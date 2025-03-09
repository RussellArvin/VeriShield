import axios from 'axios';

/**
 * Checks if an image is a deepfake using the SageMaker endpoint.
 * @param imageUrl The URL of the image to check.
 * @returns Boolean indicating if the image is a deepfake.
 */
export const checkDeepfake = async (imageUrl: string): Promise<boolean> => {
    try {
        const apiEndpoint = process.env.DEEPFAKE_API_ENDPOINT;
        
        if (!apiEndpoint) {
            throw new Error('DEEPFAKE_API_ENDPOINT environment variable is not set');
        }
        
        // Call the SageMaker endpoint through the API Gateway proxy
        const response = await axios.post(apiEndpoint, {
            url: imageUrl
        });
        
        // The response from the SageMaker model
        // Assuming the response contains a probability or classification
        const result = response.data;
        
        // Check the prediction result
        // The exact structure depends on your model's output format
        // This is an example - adjust according to your model's response format
        if (result.prediction && result.prediction.includes('fake')) {
            return true;
        } else if (result.probability && result.probability > 0.5) {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`Error checking deepfake for image ${imageUrl}:`, error);
        // Default to false if there's an error
        return false;
    }
};