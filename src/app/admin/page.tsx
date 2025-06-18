'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Type definitions
export interface AdminStudentData {
  id: number
  name: string
  image?: string
  status: 'high-risk' | 'medium-risk' | 'low-risk' | 'active'
  lastSession?: string
  lastSessionDate?: string
  missedSessions?: number
  academicTrend?: 'declining' | 'improving' | 'stagnant'
  engagementScore?: number
  assignedTutorName?: string
  churnProbability?: number
  notes?: string
}

export interface AdminTutorData {
  id: number
  name: string
  email: string
  profileImageUrl: string
  studentCount: number
  totalSessionsConducted: number
  averageRating: number
  retentionScore: number
  revenueGenerated: number
  lastActive: string
}

// Mock data - replace with real API calls
const studentsAtRisk = [
  {
    id: 1,
    name: 'Saanvi Patel',
    image: '/Saanvi.png',
    status: 'high-risk',
    lastSession: '3 days ago',
    missedSessions: 2,
    academicTrend: 'declining',
    engagementScore: 32
  },
  {
    id: 2,
    name: 'Marcus Chen',
    image: '/Marcus.png',
    status: 'medium-risk',
    lastSession: '1 day ago',
    missedSessions: 1,
    academicTrend: 'stagnant',
    engagementScore: 58
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    image: '/Emma.png',
    status: 'medium-risk',
    lastSession: '2 days ago',
    missedSessions: 0,
    academicTrend: 'declining',
    engagementScore: 45
  }
]

const tutorLeaderboard = [
  {
    id: 1,
    name: 'Ali Hassan',
    image: '/Ali.png',
    retentionScore: 94,
    starRating: 4.8,
    totalSessions: 156,
    revenue: 12400,
    studentsActive: 23
  },
  {
    id: 2,
    name: 'Sarah Kim',
    image: '/Sarah.png',
    retentionScore: 91,
    starRating: 4.7,
    totalSessions: 142,
    revenue: 11360,
    studentsActive: 19
  },
  {
    id: 3,
    name: 'David Thompson',
    image: '/David.png',
    retentionScore: 88,
    starRating: 4.6,
    totalSessions: 134,
    revenue: 10720,
    studentsActive: 17
  }
]

const retentionMetrics = {
  currentRetention: 87.3,
  previousRetention: 84.1,
  churnRate: 12.7,
  previousChurnRate: 15.9,
  newStudentsThisWeek: 24,
  newStudentsLastWeek: 18
}

export default function AdminDashboard() {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high-risk':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium-risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'declining':
        return '📉'
      case 'improving':
        return '📈'
      default:
        return '➡️'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: 2 min ago</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Retention Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Student Retention</p>
                <p className="text-3xl font-bold text-gray-900">{retentionMetrics.currentRetention}%</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +{(retentionMetrics.currentRetention - retentionMetrics.previousRetention).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-3xl font-bold text-gray-900">{retentionMetrics.churnRate}%</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  -{(retentionMetrics.previousChurnRate - retentionMetrics.churnRate).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Students (Week)</p>
                <p className="text-3xl font-bold text-gray-900">{retentionMetrics.newStudentsThisWeek}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  +{retentionMetrics.newStudentsThisWeek - retentionMetrics.newStudentsLastWeek}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">247</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  +12
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Students at Risk */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Students at Risk</h2>
              <p className="text-sm text-gray-600">Students requiring immediate attention</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {studentsAtRisk.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => router.push(`/admin/student/${student.id}`)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={student.image}
                        alt={student.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                            {student.status.replace('-', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getTrendIcon(student.academicTrend)} {student.academicTrend}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">Engagement: {student.engagementScore}%</p>
                      <p className="text-xs text-gray-500">Last: {student.lastSession}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tutor Leaderboard */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Tutor Leaderboard</h2>
              <p className="text-sm text-gray-600">Top performing tutors this month</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tutorLeaderboard.map((tutor, index) => (
                  <div
                    key={tutor.id}
                    onClick={() => router.push(`/admin/tutor/${tutor.id}`)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <Image
                        src={tutor.image}
                        alt={tutor.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{tutor.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600 ml-1">{tutor.starRating}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{tutor.totalSessions} sessions</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{tutor.retentionScore}% retention</p>
                      <p className="text-xs text-gray-500">${tutor.revenue.toLocaleString()} revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 