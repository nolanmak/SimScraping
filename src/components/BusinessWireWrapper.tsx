'use client';

import React from 'react';
import { BusinessWireList } from './BusinessWireList';

// Interface for article structure
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

// Props for the wrapper component
interface BusinessWireWrapperProps {
  initialArticles: Article[];
  initialCycleCount: number;
  initialTotalArticles: number;
}

// Client component wrapper that properly isolates the client-side code
export default function BusinessWireWrapper({ 
  initialArticles, 
  initialCycleCount, 
  initialTotalArticles 
}: BusinessWireWrapperProps) {
  // Directly render BusinessWireList - simpler approach
  return (
    <BusinessWireList 
      initialArticles={initialArticles}
      initialCycleCount={initialCycleCount}
      initialTotalArticles={initialTotalArticles}
    />
  );
} 