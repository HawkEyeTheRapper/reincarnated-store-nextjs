import fs from 'fs';
import path from 'path';

export type Product = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  audio?: string;
  lyrics?: string;
  category?: string;
  assetCode?: string;
  album?: string;
  trackNumber?: string;
  kind?: string;
  canonicalUrl?: string;
  metadataUrl?: string;
};

type CatalogRow = {
  slug: string;
  name: string;
  sku: string;
  price: string;
  description: string;
  categories: string;
  image_url: string;
  audio_url: string;
  asset_code: string;
  album: string;
  track_number: string;
  raw_slug: string;
  metadata_path: string;
};

type MetadataPayload = {
  schema?: string;
  generated_at?: string;
  sku?: string;
  kind?: string;
  name?: string;
  slugs?: string[];
  categories?: string[];
  price?: string;
  urls?: {
    by_slug?: string[];
    by_sku?: string;
  };
  media?: {
    image_url?: string;
    audio_url?: string;
  };
  source?: {
    catalog?: {
      rows?: Array<{
        slug?: string;
        name?: string;
        sku?: string;
        price?: string;
        description?: string;
        categories?: string;
        image_url?: string;
        audio_url?: string;
        asset_code?: string;
        album?: string;
        track_number?: string;
        raw_slug?: string;
        metadata_path?: string;
      }>;
    };
  };
};

const ASSETS_BASE_URL = process.env.ASSETS_BASE_URL || 'https://shop.omniversal.vip';
const CATALOG_CSV_URL = `${ASSETS_BASE_URL}/catalog/products.csv`;
const CATALOG_METADATA_BASE_URL = `${ASSETS_BASE_URL}/catalog/metadata`;
const LOCAL_CSV_PATH = path.join(process.cwd(), 'utils', 'products.csv');

let cachedProducts: Product[] | null = null;
let cachedAt = 0;
let productsPromise: Promise<Product[]> | null = null;
const CACHE_TTL_SECONDS = Number.parseInt(process.env.PRODUCT_CACHE_TTL_SECONDS || '900', 10);
const CACHE_TTL_MS = Number.isFinite(CACHE_TTL_SECONDS) ? CACHE_TTL_SECONDS * 1000 : 900 * 1000;

const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
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

  return values.map((value) => value.replace(/^"|"$/g, ''));
};

const parseCatalogCsv = (text: string): CatalogRow[] => {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];

  const headerLine = lines[0].trim();
  if (!headerLine) return [];
  const headers = parseCsvLine(headerLine);

  const indexOf = (header: string) => headers.indexOf(header);
  const idx = {
    slug: indexOf('slug'),
    name: indexOf('name'),
    sku: indexOf('sku'),
    price: indexOf('price'),
    description: indexOf('description'),
    categories: indexOf('categories'),
    image_url: indexOf('image_url'),
    audio_url: indexOf('audio_url'),
    asset_code: indexOf('asset_code'),
    album: indexOf('album'),
    track_number: indexOf('track_number'),
    raw_slug: indexOf('raw_slug'),
    metadata_path: indexOf('metadata_path'),
  };

  const rows: CatalogRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCsvLine(line);
    if (values.length === 0) continue;

    rows.push({
      slug: values[idx.slug] || '',
      name: values[idx.name] || '',
      sku: values[idx.sku] || '',
      price: values[idx.price] || '',
      description: values[idx.description] || '',
      categories: values[idx.categories] || '',
      image_url: values[idx.image_url] || '',
      audio_url: values[idx.audio_url] || '',
      asset_code: values[idx.asset_code] || '',
      album: values[idx.album] || '',
      track_number: values[idx.track_number] || '',
      raw_slug: values[idx.raw_slug] || '',
      metadata_path: values[idx.metadata_path] || '',
    });
  }

  return rows;
};

const normalizePrice = (value: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  const match = trimmed.match(/^\$?([0-9]+(?:\.[0-9]+)?)\s*(USD)?$/i);
  if (match) {
    return `$${match[1]}`;
  }
  return trimmed;
};

const fetchWithTimeout = async (url: string, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

const fetchText = async (url: string) => {
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${url} (${response.status})`);
  }
  return response.text();
};

const fetchJson = async (url: string) => {
  const response = await fetchWithTimeout(url);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Fetch failed: ${url} (${response.status})`);
  }
  return response.json();
};

const isMerchCategory = (category: string, sku: string) =>
  category.includes('Apparel') ||
  category.includes('Accessories') ||
  category.includes('Posters') ||
  category.includes('Stickers') ||
  sku.startsWith('HE-') ||
  sku.startsWith('OM-') ||
  sku.startsWith('R2R-');

export const isMerchProduct = (product: Product) =>
  isMerchCategory(product.category || '', product.sku || product.id);

const normalizeAssetUrl = (value: string | null | undefined): string => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;
  const base = ASSETS_BASE_URL.replace(/\/+$/, '');
  const pathPart = raw.startsWith('/') ? raw : `/${raw}`;
  return `${base}${pathPart}`;
};

const buildProductFromRow = (row: CatalogRow): Product | null => {
  const category = row.categories || '';
  const sku = row.sku || '';

  return {
    id: sku,
    sku,
    name: row.name || 'Unknown Product',
    slug: sku,
    description: row.description || '',
    price: normalizePrice(row.price),
    image: normalizeAssetUrl(row.image_url),
    audio: normalizeAssetUrl(row.audio_url),
    category: category || '',
    assetCode: row.asset_code || '',
    album: row.album || '',
    trackNumber: row.track_number || '',
  };
};

const fetchMetadataForRow = async (row: CatalogRow) => {
  if (!row.sku) return null;
  const primaryUrl = `${CATALOG_METADATA_BASE_URL}/${encodeURIComponent(row.sku)}.json`;

  try {
    const data = (await fetchJson(primaryUrl)) as MetadataPayload | null;
    if (data) {
      return { data, url: primaryUrl };
    }
  } catch {
    // Ignore primary metadata errors and fall back if possible.
  }

  if (row.metadata_path) {
    const cleaned = row.metadata_path.replace(/^\/+/, '');
    const fallbackUrl = `${ASSETS_BASE_URL}/${cleaned}`;
    try {
      const data = (await fetchJson(fallbackUrl)) as MetadataPayload | null;
      if (data) {
        return { data, url: fallbackUrl };
      }
    } catch {
      // Ignore fallback metadata errors.
    }
  }

  return null;
};

const loadProducts = async (): Promise<Product[]> => {
  let csvText = '';
  try {
    csvText = await fetchText(CATALOG_CSV_URL);
  } catch (error) {
    try {
      csvText = fs.readFileSync(LOCAL_CSV_PATH, 'utf-8');
    } catch {
      console.error('Error loading products CSV:', error);
      return [];
    }
  }

  const rows = parseCatalogCsv(csvText);
  const candidates = rows
    .map((row) => ({ row, product: buildProductFromRow(row) }))
    .filter((entry) => entry.product !== null) as Array<{ row: CatalogRow; product: Product }>;

  const enriched = await Promise.all(
    candidates.map(async ({ row, product }) => {
      const metadata = await fetchMetadataForRow(row);
      if (!metadata) return product;

      const { data, url } = metadata;
      const catalogRow = data.source?.catalog?.rows?.[0];

      return {
        ...product,
        name: data.name || catalogRow?.name || product.name,
        description: catalogRow?.description || product.description,
        price: normalizePrice(data.price || catalogRow?.price || product.price),
        image: normalizeAssetUrl(data.media?.image_url || catalogRow?.image_url || product.image),
        audio: normalizeAssetUrl(data.media?.audio_url || catalogRow?.audio_url || product.audio),
        category:
          (data.categories && data.categories.join(', ')) ||
          catalogRow?.categories ||
          product.category,
        assetCode: catalogRow?.asset_code || product.assetCode,
        album: catalogRow?.album || product.album,
        trackNumber: catalogRow?.track_number || product.trackNumber,
        kind: data.kind || product.kind,
        canonicalUrl: data.urls?.by_slug?.[0] || data.urls?.by_sku || product.canonicalUrl,
        metadataUrl: url || product.metadataUrl,
      };
    }),
  );

  return enriched;
};

export async function getProducts(): Promise<Product[]> {
  if (cachedProducts && Date.now() - cachedAt < CACHE_TTL_MS) return cachedProducts;
  if (productsPromise) return productsPromise;

  productsPromise = loadProducts()
    .then((products) => {
      cachedProducts = products;
      cachedAt = Date.now();
      return products;
    })
    .finally(() => {
      productsPromise = null;
    });

  return productsPromise;
}
