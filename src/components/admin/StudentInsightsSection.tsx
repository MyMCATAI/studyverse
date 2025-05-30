'use client'

import React from 'react';
import { AdminStudentData } from '../../app/admin/page'; // Adjust path as needed

interface StudentInsightsSectionProps {
  studentsAtRisk: AdminStudentData[];
  retentionRate: number;
  churnRate: number;
  newStudentsThisMonth: number;
  newStudentsLastMonth: number;
  getStatusColor: (status: AdminStudentData['status']) => string;
  // onNavigateToStudentDetails?: (studentId: string) => void; // For future use
}

const StudentInsightsSection: React.FC<StudentInsightsSectionProps> = ({
  studentsAtRisk,
  retentionRate,
  churnRate,
  newStudentsThisMonth,
  newStudentsLastMonth,
  getStatusColor,
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Student Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Students At Risk Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Students At Risk ({studentsAtRisk.length})</h3>
          <p className="text-sm text-gray-600">Students needing immediate attention.</p>
          <ul className="mt-2 text-sm space-y-1">
            {studentsAtRisk.slice(0, 3).map(student => (
              <li key={student.id} className="flex justify-between">
                <span>{student.name} ({student.assignedTutorName})</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>{student.status}</span>
              </li>
            ))}
          </ul>
          {studentsAtRisk.length > 3 && <p className="text-xs text-blue-500 mt-2 hover:underline cursor-pointer">View all...</p>}
        </div>

        {/* Retention & Churn */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Retention & Churn</h3>
          <div className="flex justify-around">
            <div>
              <p className="text-3xl font-bold text-green-500">{retentionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Retention Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">{churnRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Churn Rate (Est.)</p>
            </div>
          </div>
        </div>

        {/* Student Acquisition */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Student Acquisition</h3>
          <p className="text-gray-600">
            <span className="text-3xl font-bold text-blue-500">{newStudentsThisMonth}</span> New Students This Month
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Compared to {newStudentsLastMonth} last month ({newStudentsLastMonth > 0 ? (((newStudentsThisMonth - newStudentsLastMonth) / newStudentsLastMonth) * 100).toFixed(0) : 'N/A'} % change)
          </p>
        </div>
      </div>

      {/* Detailed Students At Risk Table */}
      <h3 className="text-xl font-semibold text-gray-700 mb-3">Priority Students Overview</h3>
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Tutor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Churn Prob.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Session</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentsAtRisk.length > 0 ? (
              studentsAtRisk.slice(0, 10).map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{student.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.assignedTutorName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{(student.churnProbability * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{student.lastSessionDate}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{student.notes || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-4 text-gray-500">No students currently flagged as high priority.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StudentInsightsSection; 