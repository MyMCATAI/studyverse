'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'

// Mock data - replace with real API calls
const getStudentData = (id: string) => {
  const students = {
    '1': {
      id: 1,
      name: 'Saanvi Patel',
      image: '/Saanvi.png',
      status: 'high-risk',
      enrollmentDate: '2023-09-01',
      currentTutor: 'Ali Hassan',
      tutorImage: '/Ali.png',
      subject: 'MCAT Prep',
      overallProgress: 68,
      engagementScore: 32,
      lastSession: '3 days ago',
      missedSessions: 2,
      totalSessions: 24,
      recentScores: [
        { date: '2024-01-15', subject: 'Biology', score: 72, maxScore: 100 },
        { date: '2024-01-10', subject: 'Chemistry', score: 68, maxScore: 100 },
        { date: '2024-01-05', subject: 'Physics', score: 75, maxScore: 100 },
        { date: '2023-12-28', subject: 'Biology', score: 70, maxScore: 100 },
        { date: '2023-12-20', subject: 'Chemistry', score: 65, maxScore: 100 }
      ],
      progressTrend: [45, 52, 58, 62, 65, 68],
      reports: [
        {
          id: 1,
          date: '2024-01-15',
          tutor: 'Ali Hassan',
          subject: 'Biology',
          content: 'Saanvi showed improvement in cellular biology concepts but struggles with molecular processes. Recommend additional practice with enzyme kinetics.',
          concerns: ['Molecular Biology', 'Time Management'],
          strengths: ['Cellular Biology', 'Memorization']
        },
        {
          id: 2,
          date: '2024-01-10',
          tutor: 'Ali Hassan',
          subject: 'Chemistry',
          content: 'Student missed the last session. When present, shows good understanding of organic chemistry basics but needs work on reaction mechanisms.',
          concerns: ['Attendance', 'Reaction Mechanisms'],
          strengths: ['Organic Chemistry Basics', 'Problem Solving']
        }
      ],
      upcomingSessions: [
        { date: '2024-01-20', time: '2:00 PM', subject: 'Biology', tutor: 'Ali Hassan' },
        { date: '2024-01-22', time: '3:00 PM', subject: 'Chemistry', tutor: 'Ali Hassan' }
      ]
    }
  }
  return students[id as keyof typeof students]
}

export default function StudentDetail() {
  const router = useRouter()
  const params = useParams()
  
  if (!params?.id) {
    return <div>Invalid student ID</div>
  }
  
  const student = getStudentData(params.id as string)

  if (!student) {
    return <div>Student not found</div>
  }

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
              <h1 className="text-2xl font-semibold text-gray-900">Student Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Image
                src={student.image}
                alt={student.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                    {student.status.replace('-', ' ')}
                  </span>
                  <span className="text-gray-600">Enrolled {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="text-sm text-gray-600">Current Tutor:</span>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={student.tutorImage}
                      alt={student.currentTutor}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">{student.currentTutor}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{student.overallProgress}%</p>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{student.totalSessions}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Total Sessions</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{student.missedSessions}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Missed Sessions</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{student.engagementScore}%</p>
              <p className="text-sm font-medium text-gray-600 mt-1">Engagement Score</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {student.recentScores.length > 0 ? student.recentScores[0].score : 'N/A'}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-1">Latest Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Progress Trend</h3>
              <p className="text-sm text-gray-600">Overall progress over time</p>
            </div>
            <div className="p-6">
              <div className="flex items-end justify-between h-40 space-x-2">
                {student.progressTrend.map((progress, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${(progress / Math.max(...student.progressTrend)) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900">{progress}%</p>
                      <p className="text-xs text-gray-500">Week {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Scores */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Scores</h3>
              <p className="text-sm text-gray-600">Latest assessment results</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {student.recentScores.map((score, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{score.subject}</h4>
                      <p className="text-xs text-gray-500">{new Date(score.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              score.score >= 80 ? 'bg-green-500' : 
                              score.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{score.score}/{score.maxScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Tutor Reports</h3>
            <p className="text-sm text-gray-600">Recent feedback and observations</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {student.reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{report.subject} Session</h4>
                      <p className="text-sm text-gray-600">by {report.tutor} • {new Date(report.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{report.content}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-red-700 mb-2">Areas of Concern</h5>
                      <div className="flex flex-wrap gap-2">
                        {report.concerns.map((concern, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-green-700 mb-2">Strengths</h5>
                      <div className="flex flex-wrap gap-2">
                        {report.strengths.map((strength, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <p className="text-sm text-gray-600">Scheduled tutoring sessions</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {student.upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{session.subject}</h4>
                    <p className="text-sm text-gray-600">with {session.tutor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{new Date(session.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{session.time}</p>
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