import { NextResponse } from "next/server";
import {
  fetchCurrentCycleArticles,
  fetchNextArticle,
} from "../../../services/dynamoDbService";

interface Article {
  message_id: string;
  title: string;
  description: string;
  link: string;
  location: string;
  publishedAt: string;
  cycleIndex?: number;
  [key: string]: string | number | boolean | undefined;
}

export async function GET() {
  try {
    // Fetch both the current article and cycle articles
    const [nextArticleData, cycleArticles] = await Promise.all([
      fetchNextArticle(),
      fetchCurrentCycleArticles(),
    ]);

    // Get metadata from the next article response
    const metadata = nextArticleData?.metadata || {
      cycleCount: 0,
      totalArticles: 0,
    };

    // Find the current article in the cycle
    const currentArticleId = nextArticleData?.article?.message_id;

    // Mark the current article
    const articlesWithCurrent = cycleArticles.map((article: Article) => ({
      ...article,
      isCurrent: article.message_id === currentArticleId,
    }));

    return NextResponse.json({
      articles: articlesWithCurrent,
      metadata: {
        cycleCount: metadata.cycleCount || 0,
        totalArticles: metadata.totalArticles || 0,
      },
    });
  } catch (error) {
    console.error("Error in articles API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
