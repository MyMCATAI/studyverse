'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import StudentInsightsSection from '../../components/admin/StudentInsightsSection';
import TutorPerformanceSection from '../../components/admin/TutorPerformanceSection';
import PlatformConfigurationSection from '../../components/admin/PlatformConfigurationSection';
import KalypsoChat, { KalypsoChatRef } from '@/components/kalypso/KalypsoChat';
import { KalypsoPageContext, WhiteboardBlock, WhiteboardAction } from '@/types/kalypso';

// Define the structure for each tutor's data
export interface AdminTutorData { // Exporting for use in child components if needed elsewhere
  id: string;
  name: string;
  email: string;
  studentCount: number;
  totalSessionsConducted: number;
  averageRating: number; // Example: 1-5
  lastActive: string;
  revenueGenerated: number;
  retentionScore: number; // Percentage e.g., 85 for 85%
  profileImageUrl: string; // Added for tutor photos
}

// Define the structure for each student's data
export interface AdminStudentData { // Exporting for use in child components
  id: string;
  name: string;
  assignedTutorId: string;
  assignedTutorName: string;
  status: 'At Risk' | 'Needs Attention' | 'Improving' | 'Stable' | 'Excelling';
  churnProbability: number; // 0.0 to 1.0
  currentProgress: number; // Percentage
  lastSessionDate: string; // YYYY-MM-DD
  joinDate: string; // YYYY-MM-DD
  sessionsThisMonth: number;
  notes?: string;
}

// Dummy data for the admin dashboard - TUTORS
const DUMMY_TUTOR_DATA: AdminTutorData[] = [
  {
    id: 'tutor-001',
    name: 'Esther C.',
    email: 'esther.c@example.com',
    studentCount: 15,
    totalSessionsConducted: 250,
    averageRating: 4.8,
    lastActive: '2024-07-28 10:00 AM',
    revenueGenerated: 12500,
    retentionScore: 92,
    profileImageUrl: '/tutors/EstherC.png',
  },
  {
    id: 'tutor-002',
    name: 'Prynce K.',
    email: 'prynce.k@example.com',
    studentCount: 12,
    totalSessionsConducted: 180,
    averageRating: 4.5,
    lastActive: '2024-07-28 09:15 AM',
    revenueGenerated: 9000,
    retentionScore: 85,
    profileImageUrl: '/tutors/PrynceK.png',
  },
  {
    id: 'tutor-003',
    name: 'Saanvi A.',
    email: 'saanvi.a@example.com',
    studentCount: 20,
    totalSessionsConducted: 310,
    averageRating: 4.9,
    lastActive: '2024-07-27 05:30 PM',
    revenueGenerated: 15500,
    retentionScore: 95,
    profileImageUrl: '/tutors/SaanviA.png',
  },
  {
    id: 'tutor-004',
    name: 'Ethan K. (You)',
    email: 'ethan.k.tutor@example.com',
    studentCount: 4, 
    totalSessionsConducted: 75,
    averageRating: 4.7,
    lastActive: '2024-07-29 08:00 AM',
    revenueGenerated: 3750, 
    retentionScore: 90,
    profileImageUrl: '/tutors/EthanK.png',
  },
  {
    id: 'tutor-005',
    name: 'Sophie L.',
    email: 'sophie.l@example.com',
    studentCount: 18,
    totalSessionsConducted: 220,
    averageRating: 4.6,
    lastActive: '2024-07-26 02:00 PM',
    revenueGenerated: 11000,
    retentionScore: 88,
    profileImageUrl: '/tutors/SophieL.png',
  },
];

// Dummy data for the admin dashboard - STUDENTS
const DUMMY_STUDENT_DATA: AdminStudentData[] = [
  {
    id: 'student-001',
    name: 'Liam Smith',
    assignedTutorId: 'tutor-001',
    assignedTutorName: 'Esther C.',
    status: 'Stable',
    churnProbability: 0.1,
    currentProgress: 75,
    lastSessionDate: '2024-07-25',
    joinDate: '2024-01-15',
    sessionsThisMonth: 4,
  },
  {
    id: 'student-002',
    name: 'Olivia Johnson',
    assignedTutorId: 'tutor-001',
    assignedTutorName: 'Esther C.',
    status: 'At Risk',
    churnProbability: 0.65,
    currentProgress: 40,
    lastSessionDate: '2024-07-10',
    joinDate: '2024-03-01',
    sessionsThisMonth: 1,
    notes: 'Missed last two scheduled sessions.'
  },
  {
    id: 'student-003',
    name: 'Noah Williams',
    assignedTutorId: 'tutor-002',
    assignedTutorName: 'Prynce K.',
    status: 'Improving',
    churnProbability: 0.2,
    currentProgress: 60,
    lastSessionDate: '2024-07-27',
    joinDate: '2024-02-20',
    sessionsThisMonth: 3,
  },
  {
    id: 'student-004',
    name: 'Emma Brown',
    assignedTutorId: 'tutor-003',
    assignedTutorName: 'Saanvi A.',
    status: 'Excelling',
    churnProbability: 0.05,
    currentProgress: 90,
    lastSessionDate: '2024-07-28',
    joinDate: '2023-11-05',
    sessionsThisMonth: 5,
  },
  {
    id: 'student-005',
    name: 'Oliver Jones',
    assignedTutorId: 'tutor-003',
    assignedTutorName: 'Saanvi A.',
    status: 'Needs Attention',
    churnProbability: 0.45,
    currentProgress: 50,
    lastSessionDate: '2024-07-15',
    joinDate: '2024-05-01',
    sessionsThisMonth: 2,
    notes: 'Complaining about workload difficulty.'
  },
  { id: 'student-006', name: 'Ava Garcia', assignedTutorId: 'tutor-004', assignedTutorName: 'Ethan K. (You)', status: 'Stable', churnProbability: 0.12, currentProgress: 70, lastSessionDate: '2024-07-26', joinDate: '2024-04-10', sessionsThisMonth: 4 },
  { id: 'student-007', name: 'Elijah Rodriguez', assignedTutorId: 'tutor-005', assignedTutorName: 'Sophie L.', status: 'Improving', churnProbability: 0.18, currentProgress: 65, lastSessionDate: '2024-07-25', joinDate: '2024-03-12', sessionsThisMonth: 3 },
  { id: 'student-008', name: 'Sophia Martinez', assignedTutorId: 'tutor-001', assignedTutorName: 'Esther C.', status: 'At Risk', churnProbability: 0.7, currentProgress: 35, lastSessionDate: '2024-07-05', joinDate: '2024-06-01', sessionsThisMonth: 0, notes: 'Requested a different tutor.' },
  { id: 'student-009', name: 'James Davis', assignedTutorId: 'tutor-002', assignedTutorName: 'Prynce K.', status: 'Stable', churnProbability: 0.1, currentProgress: 80, lastSessionDate: '2024-07-29', joinDate: '2023-12-15', sessionsThisMonth: 4 },
  { id: 'student-010', name: 'Isabella Wilson', assignedTutorId: 'tutor-003', assignedTutorName: 'Saanvi A.', status: 'Needs Attention', churnProbability: 0.4, currentProgress: 55, lastSessionDate: '2024-07-18', joinDate: '2024-05-20', sessionsThisMonth: 2 },
  { id: 'student-011', name: 'Alexander Miller', assignedTutorId: 'tutor-005', assignedTutorName: 'Sophie L.', status: 'Excelling', churnProbability: 0.03, currentProgress: 95, lastSessionDate: '2024-07-28', joinDate: '2024-01-02', sessionsThisMonth: 5 },
  { id: 'student-012', name: 'Mia Anderson', assignedTutorId: 'tutor-004', assignedTutorName: 'Ethan K. (You)', status: 'At Risk', churnProbability: 0.55, currentProgress: 45, lastSessionDate: '2024-07-12', joinDate: '2024-06-10', sessionsThisMonth: 1, notes: 'Low engagement in sessions.' },
  { id: 'student-013', name: 'Ethan Thomas', assignedTutorId: 'tutor-001', assignedTutorName: 'Esther C.', status: 'Improving', churnProbability: 0.22, currentProgress: 68, lastSessionDate: '2024-07-26', joinDate: '2024-02-01', sessionsThisMonth: 3 },
  { id: 'student-014', name: 'Charlotte Jackson', assignedTutorId: 'tutor-002', assignedTutorName: 'Prynce K.', status: 'Stable', churnProbability: 0.15, currentProgress: 72, lastSessionDate: '2024-07-27', joinDate: '2023-10-01', sessionsThisMonth: 4 },
  { id: 'student-015', name: 'Benjamin White', assignedTutorId: 'tutor-003', assignedTutorName: 'Saanvi A.', status: 'Excelling', churnProbability: 0.08, currentProgress: 88, lastSessionDate: '2024-07-29', joinDate: '2024-04-01', sessionsThisMonth: 5 },
  { id: 'student-016', name: 'Amelia Harris', assignedTutorId: 'tutor-005', assignedTutorName: 'Sophie L.', status: 'Needs Attention', churnProbability: 0.35, currentProgress: 58, lastSessionDate: '2024-07-19', joinDate: '2024-05-15', sessionsThisMonth: 2, notes: 'Frequently asks for extensions.' },
  { id: 'student-017', name: 'Daniel Martin', assignedTutorId: 'tutor-001', assignedTutorName: 'Esther C.', status: 'Stable', churnProbability: 0.11, currentProgress: 77, lastSessionDate: '2024-07-25', joinDate: '2024-01-20', sessionsThisMonth: 4 },
  { id: 'student-018', name: 'Harper Thompson', assignedTutorId: 'tutor-002', assignedTutorName: 'Prynce K.', status: 'At Risk', churnProbability: 0.6, currentProgress: 42, lastSessionDate: '2024-07-11', joinDate: '2024-03-05', sessionsThisMonth: 1, notes: 'Struggling with core concepts.' },
  { id: 'student-019', name: 'Lucas Garcia', assignedTutorId: 'tutor-003', assignedTutorName: 'Saanvi A.', status: 'Improving', churnProbability: 0.25, currentProgress: 62, lastSessionDate: '2024-07-27', joinDate: '2024-02-25', sessionsThisMonth: 3 },
  { id: 'student-020', name: 'Evelyn Lee', assignedTutorId: 'tutor-004', assignedTutorName: 'Ethan K. (You)', status: 'Excelling', churnProbability: 0.06, currentProgress: 92, lastSessionDate: '2024-07-28', joinDate: '2023-11-10', sessionsThisMonth: 5 },
  { id: 'student-021', name: 'Logan Walker', assignedTutorId: 'tutor-005', assignedTutorName: 'Sophie L.', status: 'Needs Attention', churnProbability: 0.48, currentProgress: 48, lastSessionDate: '2024-07-16', joinDate: '2024-05-05', sessionsThisMonth: 2 },
  { id: 'student-022', name: 'Abigail Hall', assignedTutorId: 'tutor-001', assignedTutorName: 'Esther C.', status: 'Stable', churnProbability: 0.13, currentProgress: 73, lastSessionDate: '2024-07-26', joinDate: '2024-04-15', sessionsThisMonth: 4 },
  { id: 'student-023', name: 'Henry Allen', assignedTutorId: 'tutor-002', assignedTutorName: 'Prynce K.', status: 'Improving', churnProbability: 0.19, currentProgress: 67, lastSessionDate: '2024-07-25', joinDate: '2024-03-18', sessionsThisMonth: 3 },
  { id: 'student-024', name: 'Ella Young', assignedTutorId: 'tutor-003', assignedTutorName: 'Saanvi A.', status: 'At Risk', churnProbability: 0.68, currentProgress: 38, lastSessionDate: '2024-07-06', joinDate: '2024-06-05', sessionsThisMonth: 0, notes: 'Considering dropping the course.' },
  { id: 'student-025', name: 'Jackson King', assignedTutorId: 'tutor-004', assignedTutorName: 'Ethan K. (You)', status: 'Stable', churnProbability: 0.14, currentProgress: 78, lastSessionDate: '2024-07-29', joinDate: '2023-12-20', sessionsThisMonth: 4 },
  { id: 'student-026', name: 'Scarlett Wright', assignedTutorId: 'tutor-005', assignedTutorName: 'Sophie L.', status: 'Excelling', churnProbability: 0.04, currentProgress: 93, lastSessionDate: '2024-07-28', joinDate: '2024-01-08', sessionsThisMonth: 5 },
  { id: 'student-027', name: 'Grayson Scott', assignedTutorId: 'tutor-001', assignedTutorName: 'Esther C.', status: 'Needs Attention', churnProbability: 0.42, currentProgress: 53, lastSessionDate: '2024-07-13', joinDate: '2024-06-15', sessionsThisMonth: 1 },
  { id: 'student-028', name: 'Zoe Green', assignedTutorId: 'tutor-002', assignedTutorName: 'Prynce K.', status: 'Improving', churnProbability: 0.21, currentProgress: 69, lastSessionDate: '2024-07-26', joinDate: '2024-02-05', sessionsThisMonth: 3 },
  { id: 'student-029', name: 'Carter Adams', assignedTutorId: 'tutor-003', assignedTutorName: 'Saanvi A.', status: 'Stable', churnProbability: 0.16, currentProgress: 71, lastSessionDate: '2024-07-27', joinDate: '2023-10-05', sessionsThisMonth: 4 },
  { id: 'student-030', name: 'Lily Baker', assignedTutorId: 'tutor-005', assignedTutorName: 'Sophie L.', status: 'At Risk', churnProbability: 0.58, currentProgress: 47, lastSessionDate: '2024-07-14', joinDate: '2024-04-03', sessionsThisMonth: 2, notes: 'Low quiz scores consistently.' }
];

export default function AdminDashboardPage() {
  const [studentsAtRiskData, setStudentsAtRiskData] = useState<AdminStudentData[]>([]);
  const [retentionRateData, setRetentionRateData] = useState<number>(0);
  const [churnRateData, setChurnRateData] = useState<number>(0);
  const [newStudentsThisMonthData, setNewStudentsThisMonthData] = useState<number>(0);
  const [newStudentsLastMonthData, setNewStudentsLastMonthData] = useState<number>(0);
  const [tutorSortConfig, setTutorSortConfig] = useState<{ key: keyof AdminTutorData | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const kalypsoChatRef = useRef<KalypsoChatRef>(null);
  const adminName = "Admin User";

  const [kalypsoPageContext, setKalypsoPageContext] = useState<KalypsoPageContext>(() => {
    const now = new Date();
    return {
      whiteboard: {
        greeting: `Admin Dashboard Overview`,
        subtitle: `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        mainDescription: "Key platform metrics and student risk factors are summarized below. Click for AI-powered insights.",
        blocks: []
      },
      ai: "The admin is viewing the main dashboard. Initializing context..."
    };
  });

  useEffect(() => {
    const atRiskStudents = DUMMY_STUDENT_DATA.filter(
      (student) => student.status === 'At Risk' || student.status === 'Needs Attention' || student.churnProbability > 0.5
    ).sort((a,b) => b.churnProbability - a.churnProbability);
    setStudentsAtRiskData(atRiskStudents);

    const totalStudents = DUMMY_STUDENT_DATA.length;
    const churnedStudentsCount = DUMMY_STUDENT_DATA.filter(s => s.status === 'At Risk' || s.churnProbability > 0.6).length;
    const currentRetentionRate = totalStudents > 0 ? ((totalStudents - churnedStudentsCount) / totalStudents) * 100 : 0;
    setRetentionRateData(currentRetentionRate);
    setChurnRateData(100 - currentRetentionRate);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const thisMonthNewStudents = DUMMY_STUDENT_DATA.filter(student => {
      const join = new Date(student.joinDate);
      return join.getMonth() === currentMonth && join.getFullYear() === currentYear;
    }).length;
    setNewStudentsThisMonthData(thisMonthNewStudents);

    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(currentMonth - 1);
    const lastMonth = lastMonthDate.getMonth();
    const yearForLastMonth = lastMonthDate.getFullYear();

    const lastMonthNewStudents = DUMMY_STUDENT_DATA.filter(student => {
      const join = new Date(student.joinDate);
      return join.getMonth() === lastMonth && join.getFullYear() === yearForLastMonth;
    }).length;
    setNewStudentsLastMonthData(lastMonthNewStudents);

    setKalypsoPageContext(prevContext => {
      const topAtRiskStudentsList = atRiskStudents.slice(0, 3);
      const topAtRiskStudentsNames = topAtRiskStudentsList.map(s => `${s.name} (Churn: ${(s.churnProbability * 100).toFixed(0)}%)`).join(', ');
      
      const growthDiff = Math.abs(thisMonthNewStudents - lastMonthNewStudents);
      const growthText = thisMonthNewStudents === lastMonthNewStudents ? 'no change' : (thisMonthNewStudents > lastMonthNewStudents ? `up by ${growthDiff}` : `down by ${growthDiff}`);

      const whiteboardBlocks: WhiteboardBlock[] = [
        {
          id: 'students_at_risk_summary',
          title: `Students At Risk (${atRiskStudents.length})`,
          description: `Top at risk: ${atRiskStudents.length > 0 ? topAtRiskStudentsNames : 'None'}. Focus on these students to mitigate churn.`,
          action: { type: 'callback', value: 'show_at_risk_details', text: 'Analyze At-Risk Students' }
        },
        {
          id: 'retention_churn_metrics',
          title: `Retention & Churn Rates`,
          description: `Current Retention: ${currentRetentionRate.toFixed(1)}%. Churn Rate: ${churnRateData.toFixed(1)}%.`,
          action: { type: 'callback', value: 'analyze_retention_churn', text: 'Insights on Retention/Churn' }
        },
        {
          id: 'student_acquisition_metrics',
          title: `Student Acquisition (This Month)`,
          description: `${thisMonthNewStudents} new students. Compared to last month (${lastMonthNewStudents}), this is ${growthText}.`,
          action: { type: 'callback', value: 'analyze_student_acquisition', text: 'Growth Strategy Insights' }
        }
      ];
      
      // Detailed at-risk student context for AI
      let atRiskStudentContextForAI = "Key students at risk currently include:";
      if (atRiskStudents.length > 0) {
        atRiskStudentContextForAI += atRiskStudents.slice(0, 10).map(s => `\n- ${s.name} (Assigned Tutor: ${s.assignedTutorName}, Churn Probability: ${(s.churnProbability * 100).toFixed(0)}%, Status: ${s.status})`).join('');
      } else {
        atRiskStudentContextForAI += " None currently identified as high risk.";
      }
      atRiskStudentContextForAI += "\nConsider this student risk information in your analysis and recommendations.";

      return {
        ...prevContext,
        whiteboard: {
          ...prevContext.whiteboard,
          blocks: whiteboardBlocks,
        },
        ai: `Admin is viewing the dashboard. Key Metrics: ${atRiskStudents.length} students at risk (Top names: ${topAtRiskStudentsNames || 'None'}). Retention: ${currentRetentionRate.toFixed(1)}%. Churn: ${churnRateData.toFixed(1)}%. New students this month: ${thisMonthNewStudents} (vs ${lastMonthNewStudents} last month - ${growthText}).\n\n${atRiskStudentContextForAI}`
      };
    });

  }, []);

  const handleTutorNameClick = (tutor: AdminTutorData) => {
    console.log(`Navigate to tutor detail page for ${tutor.name} (ID: ${tutor.id})`);
    console.log(`Reports for ${tutor.name} would be displayed here.`);
    alert(`Displaying details for ${tutor.name}\nRevenue Generated: $${tutor.revenueGenerated.toLocaleString()}`);
  };

  const getStatusColor = (status: AdminStudentData['status']) => {
    switch (status) {
      case 'At Risk': return 'text-red-600 bg-red-100';
      case 'Needs Attention': return 'text-yellow-600 bg-yellow-100';
      case 'Improving': return 'text-blue-600 bg-blue-100';
      case 'Stable': return 'text-green-600 bg-green-100';
      case 'Excelling': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedTutors = React.useMemo(() => {
    let sortableItems = [...DUMMY_TUTOR_DATA];
    if (tutorSortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[tutorSortConfig.key!] < b[tutorSortConfig.key!]) {
          return tutorSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[tutorSortConfig.key!] > b[tutorSortConfig.key!]) {
          return tutorSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [tutorSortConfig]);

  const requestSortTutors = (key: keyof AdminTutorData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (tutorSortConfig.key === key && tutorSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setTutorSortConfig({ key, direction });
  };

  const handleWhiteboardAction = useCallback((action: WhiteboardAction) => {
    console.log("Admin Dashboard - Whiteboard action triggered:", action);
    if (!kalypsoChatRef.current) return;

    kalypsoChatRef.current.clearChatHistory();
    let prompt = "";

    if (action.type === 'callback') {
      switch (action.value) {
        case 'show_at_risk_details':
          const topAtRiskStudentsText = studentsAtRiskData.slice(0,5).map(s => `${s.name} (Tutor: ${s.assignedTutorName}, Churn Prob: ${(s.churnProbability * 100).toFixed(0)}%, Last Session: ${s.lastSessionDate}, Notes: ${s.notes || 'N/A'})`).join('\n - ');
          prompt = `I'm looking at the students at risk. We have ${studentsAtRiskData.length} students identified as at risk or needing attention. Some of the top at-risk students include: \n - ${topAtRiskStudentsText}\n\nBased on this, what are the common themes or urgent intervention points for these students? What strategies could we (as platform admin) suggest or implement to support our tutors in addressing these high-risk students effectively? Provide a CONCISE, plain text response. Do NOT use markdown.`;
          break;
        case 'analyze_retention_churn':
          prompt = `Our current retention rate is ${retentionRateData.toFixed(1)}% and churn rate is ${churnRateData.toFixed(1)}%. Given the context that we have ${studentsAtRiskData.length} students currently identified as at risk or needing attention, what are the likely primary drivers contributing to our churn? What high-level, actionable strategies can we, as administrators, consider to improve overall student retention on the platform? Provide a CONCISE, plain text response. Do NOT use markdown.`;
          break;
        case 'analyze_student_acquisition':
          const growthDiffContext = Math.abs(newStudentsThisMonthData - newStudentsLastMonthData);
          const growthTrendContext = newStudentsThisMonthData === newStudentsLastMonthData ? 'remained the same' : (newStudentsThisMonthData > newStudentsLastMonthData ? `an increase of ${growthDiffContext}` : `a decrease of ${growthDiffContext}`);
          prompt = `Student acquisition this month is ${newStudentsThisMonthData}, which is ${growthTrendContext} compared to ${newStudentsLastMonthData} last month. What internal or external factors might be influencing this trend? What are 2-3 actionable strategies the platform could implement to boost student acquisition for the upcoming month? Provide a CONCISE, plain text response. Do NOT use markdown.`;
          break;
        default:
          prompt = `An action with the value '${action.value}' was triggered from the admin dashboard whiteboard. Provide a brief overview of what this type of metric or action typically relates to in platform management and why an admin would be interested in it. Provide a CONCISE, plain text response. Do NOT use markdown.`;
      }
      if (prompt) {
        kalypsoChatRef.current.sendAutomatedMessage(prompt, true);
      }
    }
  }, [studentsAtRiskData, retentionRateData, churnRateData, newStudentsThisMonthData, newStudentsLastMonthData]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-slate-800 shadow-md p-4 sticky top-0 z-50">
        <h1 className="text-xl font-semibold text-white">StudyVerse Admin Dashboard</h1>
      </nav>

      <main className="flex-1 p-6 overflow-auto">
        
        <StudentInsightsSection 
          studentsAtRisk={studentsAtRiskData}
          retentionRate={retentionRateData}
          churnRate={churnRateData}
          newStudentsThisMonth={newStudentsThisMonthData}
          newStudentsLastMonth={newStudentsLastMonthData}
          getStatusColor={getStatusColor}
        />

        <TutorPerformanceSection 
          tutors={sortedTutors}
          sortConfig={tutorSortConfig}
          requestSort={requestSortTutors}
          onTutorNameClick={handleTutorNameClick}
        />
        
        <PlatformConfigurationSection />

      </main>

      <KalypsoChat 
        ref={kalypsoChatRef}
        pageContext={kalypsoPageContext} 
        userName={adminName} 
        userRole="admin"
        onWhiteboardAction={handleWhiteboardAction}
      />
    </div>
  );
} 