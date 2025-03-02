'use client';
import { useState } from 'react';
import PortfolioItem from '../components/PortfolioItem';
import { CircularProgress } from '@mui/material';

const categories = ['All', 'Web Development', 'UI/UX Design', 'Mobile Development'];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = portfolios.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skillsDeliverables?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white container mx-auto">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
          <p className="text-gray-300 text-lg">Discover our latest work and creative projects</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((portfolio) => (
              <PortfolioItem key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600">No projects found matching your criteria</h3>
          </div>
        )}
      </div>
    </div>
  );
} 