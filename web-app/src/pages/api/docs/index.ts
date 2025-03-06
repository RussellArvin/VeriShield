import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

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
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
  examples: {
    title: string;
    description: string;
    code: string;
  }[];
  responseExample: string;
}

// Define the structure of an API doc
export interface ApiDoc {
  slug: string;
  metadata: ApiDocMetadata;
  source: string;
}

// Path to the API documentation directory
const apiDocsDirectory = path.join(process.cwd(), 'src/content/api-docs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { slug } = req.query;

    // Return a specific doc if slug is provided
    if (slug && typeof slug === 'string') {
      const doc = await getApiDoc(slug);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }
      return res.status(200).json(doc);
    }

    // Otherwise return all docs
    const docs = await getApiDocs();
    return res.status(200).json(docs);
  } catch (error) {
    console.error('Error fetching API docs:', error);
    return res.status(500).json({ error: 'Failed to fetch API documentation' });
  }
}

// Function to get all API docs
async function getApiDocs(): Promise<ApiDoc[]> {
  // Check if the directory exists
  if (!fs.existsSync(apiDocsDirectory)) {
    console.warn('API docs directory does not exist:', apiDocsDirectory);
    return [];
  }

  // Get all files in the directory
  const filenames = fs.readdirSync(apiDocsDirectory);
  
  // Filter only markdown files
  const markdownFiles = filenames.filter(filename => filename.endsWith('.md'));

  // Parse each file and extract metadata
  const docs = await Promise.all(
    markdownFiles.map(async (filename) => {
      const filePath = path.join(apiDocsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);
      
      // Convert markdown to HTML
      const processedContent = await remark()
        .use(html)
        .process(content);
      const contentHtml = processedContent.toString();
      
      // Prepare the slug from the filename
      const slug = filename.replace(/\.md$/, '');
      
      // Add default values for optional fields
      const metadata = {
        ...data,
        examples: data.examples || [],
        parameters: data.parameters || [],
      } as ApiDocMetadata;
      
      // Return the parsed doc
      return {
        slug,
        metadata,
        source: contentHtml,
      };
    })
  );
  
  return docs;
}

// Function to get a specific API doc by slug
async function getApiDoc(slug: string): Promise<ApiDoc | null> {
  const docs = await getApiDocs();
  return docs.find(doc => doc.slug === slug) || null;
}