const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1";

export interface ScrapeResult {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: any;
    content?: string;
  };
  error?: string;
}

export interface MapResult {
  success: boolean;
  links?: string[];
  error?: string;
}

export interface ExtractResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const apiKey = (import.meta.env.VITE_FIRECRAWL_API_KEY as string) || "";
  
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        formats: ['markdown']
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || response.statusText };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error scraping with Firecrawl:", error);
    return { success: false, error: error.message };
  }
}

export async function mapDomain(url: string): Promise<MapResult> {
  const apiKey = (import.meta.env.VITE_FIRECRAWL_API_KEY as string) || "";
  
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/map`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || response.statusText };
    }

    const result = await response.json();
    return { success: true, links: result.links };
  } catch (error: any) {
    console.error("Error mapping with Firecrawl:", error);
    return { success: false, error: error.message };
  }
}

export async function extractBranding(url: string): Promise<any> {
  const apiKey = (import.meta.env.VITE_FIRECRAWL_API_KEY as string) || "";
  
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        url,
        formats: ['markdown']
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || response.statusText };
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Error extracting branding with Firecrawl:", error);
    return { success: false, error: error.message };
  }
}
export async function extractStructured(url: string, prompt: string, schema?: any): Promise<ExtractResult> {
  const apiKey = (import.meta.env.VITE_FIRECRAWL_API_KEY as string) || "";
  
  try {
    const body: any = {
      url,
      formats: ['extract'],
      extract: {
        prompt
      }
    };
    
    if (schema) {
      body.extract.schema = schema;
    }

    const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || response.statusText };
    }

    const result = await response.json();
    return { success: true, data: result.data.extract };
  } catch (error: any) {
    console.error("Error extracting with Firecrawl:", error);
    return { success: false, error: error.message };
  }
}
