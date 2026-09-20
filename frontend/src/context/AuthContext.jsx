import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_FACULTY = {
  name: 'Dr. Evelyn Reed',
  email: 'e.reed@institution.edu',
  department: 'Faculty of Computer Science & Engineering',
  role: 'Academic Mentor / Lead Instructor',
  facultyId: 'FAC_7042',
};

export function AuthProvider({ children }) {
  const [faculty, setFaculty] = useState(() => {
    try {
      const saved = localStorage.getItem('ssp_faculty_user');
      return saved ? JSON.parse(saved) : DEFAULT_FACULTY;
    } catch {
      return DEFAULT_FACULTY;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('ssp_faculty_user', JSON.stringify(faculty));
    } catch (e) {
      console.warn('Could not save faculty user to localStorage', e);
    }
  }, [faculty]);

  const updateFaculty = (updatedInfo) => {
    setFaculty((prev) => ({ ...prev, ...updatedInfo }));
  };

  const logout = () => {
    setFaculty(DEFAULT_FACULTY);
    try {
      localStorage.removeItem('ssp_faculty_user');
    } catch (e) {
      console.warn('Could not remove faculty user from localStorage', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        faculty,
        updateFaculty,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
