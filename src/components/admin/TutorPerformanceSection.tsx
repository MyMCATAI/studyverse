'use client'

import React from 'react';
import Image from 'next/image'; // Import Image component
import { AdminTutorData } from '../../app/admin/page'; // Adjust path as needed
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react'; // Using Lucide icons

interface TutorPerformanceSectionProps {
  tutors: AdminTutorData[];
  sortConfig: { key: keyof AdminTutorData | null; direction: 'ascending' | 'descending' };
  requestSort: (key: keyof AdminTutorData) => void;
  onTutorNameClick: (tutor: AdminTutorData) => void;
}

const TutorPerformanceSection: React.FC<TutorPerformanceSectionProps> = ({
  tutors,
  sortConfig,
  requestSort,
  onTutorNameClick,
}) => {
  const columns: { label: string; key: keyof AdminTutorData | 'photo' | 'actions'; sortable?: boolean }[] = [
    { label: 'Photo', key: 'photo', sortable: false }, // New Photo column
    { label: 'Tutor Name', key: 'name', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Active Students', key: 'studentCount', sortable: true },
    { label: 'Total Sessions', key: 'totalSessionsConducted', sortable: true },
    { label: 'Avg. Rating', key: 'averageRating', sortable: true },
    { label: 'Retention Score', key: 'retentionScore', sortable: true },
    { label: 'Revenue Generated', key: 'revenueGenerated', sortable: true },
    { label: 'Last Active', key: 'lastActive', sortable: true },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Tutor Performance Overview</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => col.sortable !== false && requestSort(col.key as keyof AdminTutorData)} // Type assertion
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''} select-none`}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable !== false && sortConfig.key === col.key ? (
                      sortConfig.direction === 'ascending' ? (
                        <ArrowUp className="w-4 h-4 ml-1.5" />
                      ) : (
                        <ArrowDown className="w-4 h-4 ml-1.5" />
                      )
                    ) : col.sortable !== false ? (
                      <ArrowUpDown className="w-4 h-4 ml-1.5 opacity-50" />
                    ) : null}
                  </div>
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tutors.map((tutor) => (
              <tr key={tutor.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Image 
                    src={tutor.profileImageUrl}
                    alt={tutor.name}
                    width={40} // Small image size
                    height={40}
                    className="rounded-full object-cover"
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  onClick={() => onTutorNameClick(tutor)}
                >
                  {tutor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tutor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tutor.studentCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tutor.totalSessionsConducted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {tutor.averageRating.toFixed(1)} ⭐
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{tutor.retentionScore}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  ${tutor.revenueGenerated.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tutor.lastActive}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onTutorNameClick(tutor)} // Assuming this should still work for consistency, even if name is clickable
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TutorPerformanceSection; 