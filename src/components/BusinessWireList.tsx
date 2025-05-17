'use client';

import React, { useState } from 'react';
import '../components/BusinessWireList.css';

const ITEMS_PER_PAGE = 10;

// Direct API endpoints
const API_BASE_URL = 'https://b6zibzuazj.execute-api.us-east-1.amazonaws.com';
const RESET_ENDPOINT = `${API_BASE_URL}/LFG/LinkSimulation/reset`;

interface Article {
  message_id: string;
  title: string;
  description: string;
  link: string;
  location: string;
  publishedAt: string;
  isCurrent?: boolean;
  cycleIndex?: number;
}

interface BusinessWireListProps {
  initialArticles: Article[];
  initialCycleCount: number;
  initialTotalArticles: number;
}

export const BusinessWireList: React.FC<BusinessWireListProps> = ({
  initialArticles,
  initialCycleCount,
  initialTotalArticles
}) => {
  const [articles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cycleCount] = useState<number>(initialCycleCount);
  const [totalArticles] = useState<number>(initialTotalArticles);

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, endIndex);

  // Find the current article
  const currentArticle = articles.find(a => a.isCurrent);
  
  // Calculate cycling progress
  const cycleProgress = totalArticles > 0 ? 
    Math.round((currentArticle?.cycleIndex || 0) / totalArticles * 100) : 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleResetCycle = async () => {
    try {
      setLoading(true);
      
      // Call the reset API directly
      const response = await fetch(RESET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // Add these options to match the working CRA code
        credentials: 'omit',
        mode: 'cors',
        keepalive: true
      });
      
      if (!response.ok) {
        throw new Error(`Reset failed with status: ${response.status}`);
      }
      
      // Reload the page after reset to get fresh data
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setError('An error occurred while resetting the cycle.');
      setLoading(false);
    }
  };
  
  const handleRefresh = () => {
    // Reload the page to get fresh data
    window.location.reload();
  };

  if (loading) {
    return <div className="bw-loading">Resetting cycle...</div>;
  }

  if (error) {
    return <div className="bw-error">{error}</div>;
  }

  if (articles.length === 0) {
    return (
      <div className="bw-no-articles">
        <p>No articles found. Waiting for articles to be published...</p>
        <div className="bw-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="bw-container">
      <div className="bw-header">
        <h1>Business Wire</h1>
        <p className="bw-tagline">Where Companies Get Their News Heard</p>
        <div className="bw-controls">
          <button 
            onClick={handleRefresh}
            className="bw-refresh-button"
          >
            Refresh Articles
          </button>
          <button 
            onClick={handleResetCycle}
            className="bw-reset-button"
          >
            Reset Cycle
          </button>
        </div>
        {totalArticles > 0 && (
          <div className="bw-cycle-progress">
            <div className="bw-cycle-bar">
              <div 
                className="bw-cycle-fill" 
                style={{ width: `${cycleProgress}%` }}
                title={`Cycling progress: ${cycleProgress}%`}
              ></div>
            </div>
            <div className="bw-cycle-text">
              Cycle #{cycleCount} - Progress: {cycleProgress}% ({currentArticle?.cycleIndex || 0}/{totalArticles})
            </div>
          </div>
        )}
      </div>
      
      <div className="bw-content">
        {currentArticles.map((article) => (
          <div 
            key={article.message_id} 
            className={`article-item ${article.isCurrent ? 'current-article' : ''}`}
          >
            <h2 className="text-primary">
              <a 
                href={article.link} 
                className="article-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {article.title || 'Untitled Article'}
              </a>
            </h2>
            <div className="rich-text">
              <p>{article.description || 'No description available'}</p>
            </div>
            <div className="bw-metadata">
              <span className="bw-date">{new Date().toLocaleDateString('en-US', {
                timeZone: 'America/New_York',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</span>
              <span className="bw-location">{article.location || 'NEW YORK'}</span>
              <span className="bw-published">Published at {article.publishedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="bw-pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bw-pagination-button"
        >
          Previous
        </button>
        <span className="bw-pagination-info">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bw-pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}; 