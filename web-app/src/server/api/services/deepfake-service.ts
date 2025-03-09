import axios from 'axios';

interface DeepFakePrediction {
  label: string;
  score: number;
}

interface DeepFakeResponse {
  filename: string;
  predictions: DeepFakePrediction[];
}

export class DeepFakeService {
  private readonly lambdaUrl: string;
  private readonly defaultEndpointName?: string;

  /**
   * Creates a new DeepFakeService
   * 
   * @param lambdaUrl - The URL of the Lambda function endpoint
   * @param defaultEndpointName - Optional default SageMaker endpoint name
   */
  constructor(lambdaUrl: string) {
    this.lambdaUrl = lambdaUrl;
    this.defaultEndpointName = "deepfake-endpoint";
  }

  /**
   * Calls the Lambda endpoint to process deep fake detection
   * 
   * @param payload - The data payload to send to the endpoint
   * @param endpointName - Optional SageMaker endpoint name (overrides default)
   * @returns Promise with a boolean result: true if the image is real, false if it's fake
   */
  public async isImageReal<TRequest>(
    payload: TRequest,
    endpointName?: string
  ): Promise<boolean> {
    try {
      // Use provided endpoint name or fall back to default
      const targetEndpoint = endpointName || this.defaultEndpointName;

      // Prepare the request body according to the Lambda function's expected format
      const requestBody = {
        body: JSON.stringify(payload),
        endpointName: targetEndpoint
      };
      
      // Call the Lambda endpoint
      const response = await axios.post<DeepFakeResponse>(this.lambdaUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Extract predictions from the response
      const predictions = response.data.predictions;
      
      // Find the "Real" prediction
      const realPrediction = predictions.find(pred => pred.label === "Real");
      
      // If "Real" prediction exists and has a score > 0.5, return true (image is real)
      // Otherwise, return false (image is fake)
      return realPrediction !== undefined && realPrediction.score > 0.5;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Lambda endpoint error:', error.response.status, error.response.data);
      } else {
        console.error('Error calling Lambda endpoint:', error);
      }
      throw error;
    }
  }
}