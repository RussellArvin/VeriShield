

export interface ApiDocParameter {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }
  
  export interface ApiDocExample {
    title: string;
    description: string;
    code: string;
  }
  
  // Define the structure of the API doc metadata
  export interface ApiDocMetadata {
    title: string;
    summary: string;
    version: string;
    updatedAt: string;
    endpoint: string;
    method: string;
    image?: string;
    deprecated?: boolean;
    deprecatedInVersion?: string;
    alternativeEndpoint?: string;
    parameters: ApiDocParameter[];
    examples: ApiDocExample[];
    responseExample: string;
  }
  
  // Define the structure of an API doc
  export interface ApiDoc {
    slug: string;
    metadata: ApiDocMetadata;
    source: string;
  }
  
  // Function to get all API docs
  export async function getApiDocs(): Promise<ApiDoc[]> {
    try {
      const response = await fetch('/api/docs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch API docs: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching API docs:', error);
      return [];
    }
  }
  
  // Function to get a specific API doc by slug
  export async function getApiDoc(slug: string): Promise<ApiDoc | null> {
    try {
      const response = await fetch(`/api/docs/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch API doc: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching API doc with slug ${slug}:`, error);
      return null;
    }
  }