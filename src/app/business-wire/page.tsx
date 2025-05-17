import BusinessWireWrapper from '../../components/BusinessWireWrapper';
import { Suspense } from 'react';

interface Article {
  message_id: string;
  title: string;
  description: string;
  link: string;
  location: string;
  publishedAt: string;
  isCurrent?: boolean;
  cycleIndex?: number;
  [key: string]: string | number | boolean | undefined;
}

// Direct API endpoint - using the original path
const API_BASE_URL = 'https://b6zibzuazj.execute-api.us-east-1.amazonaws.com';
const NEXT_ARTICLE_ENDPOINT = `${API_BASE_URL}/LFG/LinkSimulation`;

// Loading state component - pure server component (no hooks)
function BusinessWireLoading() {
  return (
    <div 
      style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#6b7280',
        fontSize: '16px' 
      }}
    >
      <div 
        style={{
          margin: '20px auto',
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0, 85, 165, 0.2)',
          borderTop: '4px solid #0055a5',
          borderRadius: '50%'
        }}
      ></div>
      <p>Loading Business Wire articles...</p>
    </div>
  );
}

// Error state component - pure server component (no hooks)
function BusinessWireError({ message }: { message: string }) {
  return (
    <div 
      style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#ef4444',
        fontSize: '16px'
      }}
    >
      {message}
    </div>
  );
}

// This is the main page component - a server component
export default async function BusinessWirePage() {
  // Create a container for our client component with proper styling
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Suspense fallback={<BusinessWireLoading />}>
        <BusinessWireContent />
      </Suspense>
    </div>
  );
}

// This is a server component that fetches data
async function BusinessWireContent() {
  // Fetch data server-side
  try {
    console.log('Fetching articles from server component...');
    
    // Fetch next article with options matching the CRA implementation
    const nextArticleResponse = await fetch(NEXT_ARTICLE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-cache',
      // Use credentials 'omit' to avoid sending cookies
      credentials: 'omit',
      // Use 'cors' mode
      mode: 'cors',
      // Add keepalive option
      keepalive: true,
      next: { revalidate: 0 }
    });
    
    // Check if next article response is ok
    if (!nextArticleResponse.ok) {
      const errorText = await nextArticleResponse.text();
      console.error('Error fetching next article:', nextArticleResponse.status, errorText);
      return <BusinessWireError message={`Failed to load articles: ${nextArticleResponse.status}`} />;
    }
    
    // Parse next article response
    const nextArticleData = await nextArticleResponse.json();
    console.log('Next article data:', nextArticleData);
    
    // Get articles from the response
    const cycleArticles = nextArticleData.cycleArticles || [];
    
    // Get metadata from the next article response
    const metadata = nextArticleData?.metadata || {
      cycleCount: 0,
      totalArticles: 0
    };
    
    // Find the current article in the cycle
    const currentArticleId = nextArticleData?.article?.message_id;
    
    // Create sample articles if none are returned from the API
    const articlesForDisplay = cycleArticles.length > 0 ? cycleArticles : generateSampleArticles();
    
    // Mark the current article and add cycle indices
    const articlesWithCurrent: Article[] = articlesForDisplay.map((article: Article, index: number) => ({
      ...article,
      isCurrent: article.message_id === currentArticleId,
      cycleIndex: index + 1
    }));
    
    console.log(`Prepared ${articlesWithCurrent.length} articles for display`);
    
    // Use our wrapper component 
    return (
      <BusinessWireWrapper 
        initialArticles={articlesWithCurrent}
        initialCycleCount={metadata.cycleCount || 0}
        initialTotalArticles={metadata.totalArticles || articlesForDisplay.length}
      />
    );
  } catch (error) {
    // Show error state
    console.error('Error fetching articles:', error);
    
    // Generate sample articles as fallback
    const sampleArticles = generateSampleArticles();
    
    // Return the fallback list instead of error state
    return (
      <BusinessWireWrapper 
        initialArticles={sampleArticles}
        initialCycleCount={1}
        initialTotalArticles={sampleArticles.length}
      />
    );
  }
}

// Function to generate sample articles when API fails
function generateSampleArticles(): Article[] {
  const baseDate = new Date();
  
  return Array.from({ length: 10 }, (_, i) => {
    const date = new Date(baseDate);
    date.setHours(date.getHours() - i);
    
    return {
      message_id: `sample-${i}`,
      title: `Sample Article ${i + 1}`,
      description: `This is a sample article generated because the API is currently unavailable. It simulates what a real article would look like.`,
      link: 'https://www.businesswire.com',
      location: 'NEW YORK',
      publishedAt: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isCurrent: i === 0,
      cycleIndex: i + 1
    };
  });
} 