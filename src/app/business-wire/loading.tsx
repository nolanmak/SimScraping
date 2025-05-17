import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Articles</h2>
        <p className="text-gray-600">
          Please wait while we fetch the latest BusinessWire articles...
        </p>
      </div>
    </div>
  );
} 