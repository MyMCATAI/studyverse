'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'

// Mock data - replace with real API calls
const getTutorData = (id: string) => {
  const tutors = {
    '1': {
      id: 1,
      name: 'Ali Hassan',
      image: '/Ali.png',
      retentionScore: 94,
      starRating: 4.8,
      totalSessions: 156,
      revenue: 12400,
      studentsActive: 23,
      joinDate: '2023-08-15',
      specialties: ['MCAT Prep', 'Biology', 'Chemistry'],
      monthlyRevenue: [8200, 9100, 10500, 12400],
      monthlyRetention: [89, 91, 93, 94],
      recentStudents: [
        { id: 1, name: 'Saanvi Patel', image: '/Saanvi.png', lastSession: '2 days ago', progress: 78 },
        { id: 2, name: 'Marcus Chen', image: '/Marcus.png', lastSession: '1 day ago', progress: 85 },
        { id: 3, name: 'Emma Rodriguez', image: '/Emma.png', lastSession: '3 days ago', progress: 72 }
      ],
      weeklyStats: {
        sessionsCompleted: 12,
        avgSessionRating: 4.9,
        responseTime: '< 2 hours',
        cancellationRate: 2.1
      }
    }
  }
  return tutors[id as keyof typeof tutors]
}

export default function TutorDetail() {
  const router = useRouter()
  const params = useParams()
  
  if (!params?.id) {
    return <div>Invalid tutor ID</div>
  }
  
  const tutor = getTutorData(params.id as string)

  if (!tutor) {
    return <div>Tutor not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Tutor Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tutor Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Image
                src={tutor.image}
                alt={tutor.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{tutor.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg">★</span>
                    <span className="text-lg font-medium text-gray-900 ml-1">{tutor.starRating}</span>
                    <span className="text-gray-500 ml-1">rating</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600">Joined {new Date(tutor.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tutor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">${tutor.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{tutor.retentionScore}%</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Student Retention</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{tutor.totalSessions}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Total Sessions</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{tutor.studentsActive}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Active Students</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{tutor.weeklyStats.avgSessionRating}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Avg Session Rating</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">This Week's Performance</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Sessions Completed</span>
                  <span className="text-lg font-semibold text-gray-900">{tutor.weeklyStats.sessionsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Average Response Time</span>
                  <span className="text-lg font-semibold text-gray-900">{tutor.weeklyStats.responseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Cancellation Rate</span>
                  <span className="text-lg font-semibold text-gray-900">{tutor.weeklyStats.cancellationRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
              <p className="text-sm text-gray-600">Students tutored this week</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tutor.recentStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => router.push(`/admin/student/${student.id}`)}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={student.image}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-xs text-gray-500">Last session: {student.lastSession}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <p className="text-sm text-gray-600">Monthly revenue over the last 4 months</p>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between h-40 space-x-4">
              {tutor.monthlyRevenue.map((revenue, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(revenue / Math.max(...tutor.monthlyRevenue)) * 100}%` }}
                  ></div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">${revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Month {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 