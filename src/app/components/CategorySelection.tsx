'use client';

import { useState } from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
  questionIds: number[];
}

interface CategorySelectionProps {
  onCategoriesSelected: (selectedCategories: string[]) => void;
}

const categories: Category[] = [
  {
    id: 'transportation',
    name: 'Transportation & Street Design',
    description: 'How residents move around the city and infrastructure support',
    questionIds: [1, 2, 12]
  },
  {
    id: 'safety',
    name: 'Public Safety & Emergency Response',
    description: 'Safety in neighborhoods, police presence, mental health crisis response',
    questionIds: [3, 4]
  },
  {
    id: 'housing',
    name: 'Housing & Development',
    description: 'Housing affordability, gentrification, rent control, development priorities',
    questionIds: [5, 6]
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Improving public schools, managing charter school growth, education reform',
    questionIds: [7, 8]
  },
  {
    id: 'social',
    name: 'Social Services & Community Wellbeing',
    description: 'Immigration, healthcare access, mental health, inclusive communities',
    questionIds: [9, 10]
  },
  {
    id: 'governance',
    name: 'Governance, Climate, and Leadership',
    description: 'Climate change response, transparency, collaboration, leadership style',
    questionIds: [11, 13, 14, 15]
  }
];

export default function CategorySelection({ onCategoriesSelected }: CategorySelectionProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, categoryId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedCategories.length > 0) {
      onCategoriesSelected(selectedCategories);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-200 via-slate-50 to-red-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 title-font">
            Select Your Priority Areas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Great job completing the quiz! Now choose 1-3 categories that matter most to you. We'll recalculate your results with these areas weighted more heavily.
          </p>
          <div className="text-sm text-gray-500">
            Selected: {selectedCategories.length}/3
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryToggle(category.id)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedCategories.includes(category.id)
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {category.name}
                </h3>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedCategories.includes(category.id)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedCategories.includes(category.id) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {category.description}
              </p>
              <div className="text-xs text-gray-500">
                {category.questionIds.length} question{category.questionIds.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={selectedCategories.length === 0}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
              selectedCategories.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedCategories.length === 0 
              ? 'Select at least one category' 
              : `See My Results with ${selectedCategories.length} priorit${selectedCategories.length === 1 ? 'y' : 'ies'}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export { categories }; 