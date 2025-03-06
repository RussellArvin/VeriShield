
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { ApiDoc, ApiDocMetadata } from './index';

// Path to the API documentation directory
const apiDocsDirectory = path.join(process.cwd(), 'content/api-docs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { slug } = req.query;
    
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }
    
    const doc = await getApiDoc(slug);
    
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    return res.status(200).json(doc);
  } catch (error) {
    console.error('Error fetching API doc:', error);
    return res.status(500).json({ error: 'Failed to fetch API documentation' });
  }
}

// Function to get a specific API doc by slug
async function getApiDoc(slug: string): Promise<ApiDoc | null> {
  try {
    const filePath = path.join(apiDocsDirectory, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();
    
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
  } catch (error) {
    console.error(`Error getting API doc for slug ${slug}:`, error);
    return null;
  }
}