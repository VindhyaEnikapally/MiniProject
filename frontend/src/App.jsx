import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatasetProvider, useDataset } from './context/DatasetContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TeacherAuthModal } from './components/auth/TeacherAuthModal';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardView } from './pages/DashboardView';
import { StudentsListView } from './pages/StudentsListView';
import { StudentDetailView } from './pages/StudentDetailView';
import './App.css';

function MainApp() {
  // Top-level views: 'landing' (public website), 'auth' (sign in / sign up), 'portal' (faculty application)
  const [currentView, setCurrentView] = useState('landing');
  // Portal inner tabs: 'dashboard', 'students', 'analysis'
  const [activeTab, setActiveTab] = useState('dashboard');

  const { logout } = useAuth();
  const { selectedStudentId, setSelectedStudentId, topRiskStudents } = useDataset();

  const handleSelectStudent = (studentId) => {
    setSelectedStudentId(studentId);
    setActiveTab('analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStudents = () => {
    setActiveTab('students');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const studentToAnalyze = selectedStudentId || topRiskStudents?.[0]?.student_id;

  // 1. Landing Page View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGoToAuth={() => {
          setCurrentView('auth');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToDashboard={() => {
          setCurrentView('portal');
          setActiveTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 2. Auth Page View (Sign In / Sign Up)
  if (currentView === 'auth') {
    return (
      <AuthPage
        onSuccess={() => {
          setCurrentView('portal');
          setActiveTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToLanding={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // 3. Faculty Decision-Support Portal View
  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToLanding={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={() => {
          logout();
          setCurrentView('auth');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        <div className="main-content-container">
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectStudent={handleSelectStudent}
              onNavigateToStudents={() => {
                setActiveTab('students');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsListView onSelectStudent={handleSelectStudent} />
          )}

          {activeTab === 'analysis' && studentToAnalyze && (
            <StudentDetailView
              studentId={studentToAnalyze}
              onBack={handleBackToStudents}
              onSelectStudent={handleSelectStudent}
            />
          )}

          {activeTab === 'analysis' && !studentToAnalyze && (
            <div className="empty-selection-state">
              <div className="empty-selection-card">
                <h3>No Student Dataset Available</h3>
                <p>Please upload a student cohort dataset or choose a sample dataset from the dashboard to begin AI analysis.</p>
                <button
                  type="button"
                  className="btn btn-primary mt-4"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Go to Dashboard & Upload Dataset
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Teacher Profile Edit Modal */}
      <TeacherAuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DatasetProvider>
        <MainApp />
      </DatasetProvider>
    </AuthProvider>
  );
}