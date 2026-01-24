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
      
      // Simple split won't work for quoted fields with commas, but for now let's try a basic split 
      // and if that fails we can use a library or a more complex regex.
      // Actually, let's just do a robust split that respects quotes.
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
      
      // We only want apparel for now, so let's filter based on categories or SKU prefix
      const category = values[5] || '';
      const sku = values[2] || '';
      
      // Filter: Include if category contains "Apparel" or "Accessories" or "Posters" or "Stickers"
      // OR if it's one of the specific apparel SKUs (HE-, OM-, R2R-)
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
          slug: values[0] || '',
          description: values[4]?.replace(/^"|"$/g, '') || '',
          price: `$${values[3] || '0.00'}`,
          image: values[6] || '',
          // audio: values[7], // Commented out as we are focusing on apparel
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
