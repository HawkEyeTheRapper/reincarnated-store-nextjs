import fs from 'fs';
import path from 'path';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  audio?: string;
  lyrics?: string;
  category?: string;
};

// This function will be called at build time or runtime to parse the CSV
export function getProducts(): Product[] {
  try {
    const csvPath = path.join(process.cwd(), 'utils', 'products.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',');
    
    const products: Product[] = [];

    // Start from index 1 to skip headers
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle CSV parsing with potential quoted fields
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!matches) continue;
      
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      // Map CSV columns to Product type
      // CSV headers: slug,name,sku,price,description,categories,image_url,audio_url,asset_code,album,track_number,raw_slug,metadata_path
      
      const category = values[5] || '';
      const sku = values[2] || '';
      
      const isApparelOrMerch = 
        category.includes('Apparel') || 
        category.includes('Accessories') || 
        category.includes('Posters') || 
        category.includes('Stickers') ||
        sku.startsWith('HE-') || 
        sku.startsWith('OM-') || 
        sku.startsWith('R2R-');

      if (isApparelOrMerch) {
        products.push({
          id: sku, // Use SKU as ID
          name: values[1]?.replace(/^"|"$/g, '') || 'Unknown Product',
          slug: sku, // Use SKU as the slug for URL routing
          description: values[4]?.replace(/^"|"$/g, '') || '',
          price: `$${values[3] || '0.00'}`,
          image: values[6] || '',
          category: category.replace(/^"|"$/g, ''),
        });
      }
    }
    
    return products;
  } catch (error) {
    console.error('Error reading products CSV:', error);
    return [];
  }
}

export const mockProducts: Product[] = getProducts();
