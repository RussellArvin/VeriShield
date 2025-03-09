import * as AWS from 'aws-sdk';

const sagemakerRuntime = new AWS.SageMakerRuntime();

interface ProxyEvent {
  body: string;
  endpointName?: string;
}

interface ProxyResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
  body: string;
}

export const handler = async (event: ProxyEvent): Promise<ProxyResponse> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    const endpointName = event.endpointName || process.env.SAGEMAKER_ENDPOINT_NAME;
    
    if (!endpointName) {
      throw new Error('No SageMaker endpoint name specified');
    }
    
    // Parse the request body
    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    
    // Invoke the SageMaker endpoint
    const response = await sagemakerRuntime.invokeEndpoint({
      EndpointName: endpointName,
      ContentType: 'application/json',
      Body: JSON.stringify(requestBody)
    }).promise();
    
    // Parse and return the response
    const responseBody = response.Body ? JSON.parse(response.Body.toString()) : {};
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(responseBody)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: error.message || 'An error occurred' })
    };
  }
};