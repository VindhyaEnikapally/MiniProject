import React, { useState, useEffect, useMemo } from 'react';
import { useDataset } from '../../context/DatasetContext';
import { studentApi } from '../../api/studentApi';
import {
  Search,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Brain,
  Layers,
  Sparkles
} from '../common/Icons';

export function StudentQuickSwitcher({ currentStudentId, onSelectStudent, onBackToDirectory }) {
  const { activeDatasetId, activeDatasetName, topRiskStudents } = useDataset();
  const [allStudents, setAllStudents] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load cohort students for fast switching
  useEffect(() => {
    if (!activeDatasetId) return;

    let isMounted = true;
    setLoadingList(true);

    studentApi.searchStudents(activeDatasetId, '', 100)
      .then((res) => {
        if (isMounted && res?.success && res?.students) {
          setAllStudents(res.students);
        }
      })
      .catch((err) => {
        console.warn('Could not load cohort student list for quick switcher:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingList(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeDatasetId]);

  // Combine loaded students or fallback to topRiskStudents
  const studentPool = allStudents.length > 0 ? allStudents : (topRiskStudents || []);

  // Find index of current student
  const currentIndex = studentPool.findIndex((s) => s.student_id === currentStudentId);
  const prevStudent = currentIndex > 0 ? studentPool[currentIndex - 1] : null;
  const nextStudent = currentIndex >= 0 && currentIndex < studentPool.length - 1 ? studentPool[currentIndex + 1] : null;

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return studentPool;
    const q = searchQuery.toLowerCase();
    return studentPool.filter((s) =>
      s.student_id.toLowerCase().includes(q) ||
      (s.prediction && s.prediction.toLowerCase().includes(q))
    );
  }, [studentPool, searchQuery]);

  const handleSelect = (id) => {
    onSelectStudent(id);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="student-quick-switcher-card">
      <div className="switcher-top-row">
        {/* Left: Navigation & Breadcrumb */}
        <div className="switcher-nav-controls">
          <button
            type="button"
            className="btn btn-sm btn-secondary switcher-back-btn"
            onClick={onBackToDirectory}
            title="Return to Student Risk Directory"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Directory</span>
          </button>

          <div className="switcher-current-badge">
            <span className="switcher-dot" />
            <span className="switcher-label">Inspecting:</span>
            <strong className="switcher-id font-mono">{currentStudentId}</strong>
            {currentIndex >= 0 && (
              <span className="switcher-rank-pill">
                #{currentIndex + 1} of {studentPool.length}
              </span>
            )}
          </div>
        </div>

        {/* Center: Search & Select Dropdown */}
        <div className="switcher-search-dropdown-wrap">
          <div className="switcher-dropdown-anchor">
            <button
              type="button"
              className="switcher-dropdown-toggle-btn"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <Search className="w-4 h-4 text-muted mr-1.5" />
              <span className="switcher-dropdown-text">
                {currentStudentId ? `Switch Student (${currentStudentId})` : 'Select Student...'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted ml-auto" />
            </button>

            {isDropdownOpen && (
              <div className="switcher-menu-popup">
                <div className="switcher-search-bar">
                  <Search className="w-3.5 h-3.5 text-muted mr-2" />
                  <input
                    type="text"
                    placeholder="Search by student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="switcher-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="switcher-clear-search"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="switcher-student-list">
                  {filteredStudents.length === 0 ? (
                    <div className="switcher-empty-msg">No students found matching "{searchQuery}"</div>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const prob = s.risk_percentage ?? ((s.risk_probability || 0) * 100);
                      const isHigh = prob >= 70;
                      const isMedium = prob >= 40 && prob < 70;
                      const isCurrent = s.student_id === currentStudentId;

                      return (
                        <button
                          key={s.student_id}
                          type="button"
                          className={`switcher-item ${isCurrent ? 'switcher-item-active' : ''}`}
                          onClick={() => handleSelect(s.student_id)}
                        >
                          <div className="switcher-item-left">
                            <span className="switcher-item-rank">#{idx + 1}</span>
                            <span className="switcher-item-id font-mono">{s.student_id}</span>
                          </div>

                          <div className="switcher-item-right">
                            <span
                              className={`switcher-item-prob ${
                                isHigh ? 'text-danger' : isMedium ? 'text-warning' : 'text-success'
                              }`}
                            >
                              {Number(prob).toFixed(1)}%
                            </span>
                            <span
                              className={`switcher-mini-badge ${
                                isHigh
                                  ? 'mini-badge-danger'
                                  : isMedium
                                  ? 'mini-badge-warning'
                                  : 'mini-badge-success'
                              }`}
                            >
                              {isHigh ? 'High' : isMedium ? 'Med' : 'Low'}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Previous / Next Stepper */}
        <div className="switcher-stepper-controls">
          <button
            type="button"
            className="btn btn-sm btn-secondary switcher-stepper-btn"
            disabled={!prevStudent}
            onClick={() => prevStudent && handleSelect(prevStudent.student_id)}
            title={prevStudent ? `Previous: ${prevStudent.student_id}` : 'No previous student'}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Prev</span>
          </button>

          <button
            type="button"
            className="btn btn-sm btn-secondary switcher-stepper-btn"
            disabled={!nextStudent}
            onClick={() => nextStudent && handleSelect(nextStudent.student_id)}
            title={nextStudent ? `Next: ${nextStudent.student_id}` : 'No next student'}
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Quick-Jump Pills for Top 5 High-Risk */}
      {topRiskStudents && topRiskStudents.length > 0 && (
        <div className="switcher-quick-pills-row">
          <div className="quick-pills-label">
            <ShieldAlert className="w-3.5 h-3.5 text-danger mr-1" />
            <span>Top High Risk:</span>
          </div>

          <div className="quick-pills-list">
            {topRiskStudents.slice(0, 5).map((s, idx) => {
              const isSelected = s.student_id === currentStudentId;
              const prob = s.risk_percentage ?? ((s.risk_probability || 0) * 100);
              return (
                <button
                  key={s.student_id}
                  type="button"
                  className={`quick-pill-btn ${isSelected ? 'quick-pill-active' : ''}`}
                  onClick={() => handleSelect(s.student_id)}
                >
                  <span className="quick-pill-rank font-mono">#{idx + 1}</span>
                  <span className="quick-pill-id font-mono">{s.student_id}</span>
                  <span className="quick-pill-risk">{Number(prob).toFixed(0)}%</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
