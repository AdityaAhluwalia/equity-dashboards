import React from 'react';
import { Company } from '@/types/ui.types';
import PhaseIndicator from './PhaseIndicator';

// Utility function for Indian number formatting
const formatIndianNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

interface CompanyHeaderProps {
  company: Company;
  loading?: boolean;
  error?: string | null;
}

export default function CompanyHeader({ 
  company, 
  loading = false, 
  error = null 
}: CompanyHeaderProps) {
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg mb-3 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded-lg mb-2 w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100">
        <div className="flex items-center text-red-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {company.name}
            </h1>
            <PhaseIndicator phase={company.currentPhase} size="large" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Sector:</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                {company.sector}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Industry:</span>
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">
                {company.industry}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Market Cap:</span>
              <span className="font-mono">
                ₹{formatIndianNumber(Math.round(company.marketCap / 1000))} Cr
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-2">Company Type:</span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                company.companyType === 'finance' 
                  ? 'bg-purple-50 text-purple-700' 
                  : 'bg-gray-50 text-gray-700'
              }`}>
                {company.companyType === 'finance' ? 'Financial Services' : 'Non-Financial'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ₹{company.currentPrice ? formatIndianNumber(company.currentPrice) : 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Current Price</div>
            {company.priceChange !== undefined && (
              <div className={`text-sm font-medium ${
                company.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {company.priceChange >= 0 ? '+' : ''}{company.priceChange.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {company.description && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm leading-relaxed">
            {company.description}
          </p>
        </div>
      )}
    </div>
  );
} 