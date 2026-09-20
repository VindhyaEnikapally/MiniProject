import React, { useState, useEffect, useMemo } from 'react';
import { studentApi } from '../../api/studentApi';
import { useDataset } from '../../context/DatasetContext';
import { RiskBadge } from '../common/RiskBadge';
import { EduBadge } from '../common/EduBadge';
import {
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from '../common/Icons';

export function StudentRiskTable({ onSelectStudent }) {
  const { activeDatasetId, activeDatasetName, activeEducationLevel } = useDataset();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('RISK_DESC'); // RISK_DESC, RISK_ASC, ID_ASC

  // Load students for active dataset
  const fetchStudents = async () => {
    if (!activeDatasetId) {
      setStudents([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await studentApi.searchStudents(activeDatasetId, searchTerm.trim(), 100);
      if (res.success) {
        setStudents(res.students || []);
      } else {
        setError('Could not retrieve student records.');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to query student database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [activeDatasetId]);

  // Handle Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  // Helper to determine risk level based on probability
  const getRiskLevel = (prob) => {
    if (prob >= 0.70) return 'High';
    if (prob >= 0.40) return 'Medium';
    return 'Low';
  };

  // Filter and sort students locally
  const filteredStudents = useMemo(() => {
    return students
      .filter((stu) => {
        const prob = stu.risk_probability || 0;
        const level = getRiskLevel(prob);
        const pred = stu.prediction || '';

        // Risk Level Filter
        if (riskFilter === 'HIGH' && level !== 'High') return false;
        if (riskFilter === 'MEDIUM' && level !== 'Medium') return false;
        if (riskFilter === 'LOW' && level !== 'Low') return false;
        if (riskFilter === 'AT_RISK' && pred !== 'At Risk') return false;
        if (riskFilter === 'NOT_AT_RISK' && pred !== 'Not At Risk') return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'RISK_DESC') {
          return (b.risk_probability || 0) - (a.risk_probability || 0);
        }
        if (sortOrder === 'RISK_ASC') {
          return (a.risk_probability || 0) - (b.risk_probability || 0);
        }
        if (sortOrder === 'ID_ASC') {
          return String(a.student_id).localeCompare(String(b.student_id));
        }
        return 0;
      });
  }, [students, riskFilter, sortOrder]);

  return (
    <div className="student-table-card">
      <div className="table-header-toolbar">
        <div className="table-title-row">
          <div>
            <h2 className="table-title">Student Risk Directory</h2>
            <p className="table-subtitle">
              Comprehensive student cohort risk predictions for{' '}
              <strong className="font-mono">{activeDatasetName || activeDatasetId}</strong>
            </p>
          </div>

          <div className="table-header-chips">
            <span className="badge badge-primary font-mono">
              {students.length} Total Students
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="toolbar-controls">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="search-input-wrapper">
            <Search className="w-4 h-4 text-muted search-icon" />
            <input
              type="text"
              placeholder="Search Student ID (e.g. STU_000001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input font-mono"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setSearchTerm('');
                }}
              >
                ✕
              </button>
            )}
          </form>

          {/* Risk Filter Select */}
          <div className="select-wrapper">
            <Filter className="w-4 h-4 text-muted select-icon" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk (≥ 70%)</option>
              <option value="MEDIUM">Medium Risk (40% - 69%)</option>
              <option value="LOW">Low Risk (&lt; 40%)</option>
              <option value="AT_RISK">Model: At Risk</option>
              <option value="NOT_AT_RISK">Model: Not At Risk</option>
            </select>
          </div>

          {/* Sort Order Select */}
          <div className="select-wrapper">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="RISK_DESC">Highest Risk First</option>
              <option value="RISK_ASC">Lowest Risk First</option>
              <option value="ID_ASC">Student ID (A-Z)</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            className="icon-btn"
            title="Refresh Student List"
            onClick={fetchStudents}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="alert-box alert-danger m-4">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Content */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Education Level</th>
              <th>Risk Probability</th>
              <th>Risk Severity</th>
              <th>Model Classification</th>
              <th>Recommended Action</th>
              <th className="text-right">Inspection</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="skeleton-row">
                  <td colSpan={7} className="text-center py-4">
                    <div className="table-skeleton-line" />
                  </td>
                </tr>
              ))
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-table-cell">
                  <div className="empty-table-state">
                    <ShieldAlert className="w-8 h-8 text-muted" />
                    <p>No students match the current filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((stu) => {
                const prob = stu.risk_probability || 0;
                const riskPct = stu.risk_percentage ?? prob * 100;
                const level = getRiskLevel(prob);
                const isAtRisk = stu.prediction === 'At Risk';

                return (
                  <tr
                    key={stu.student_id}
                    className="hover-row cursor-pointer"
                    onClick={() => onSelectStudent(stu.student_id)}
                  >
                    <td className="font-mono font-semibold text-primary">
                      {stu.student_id}
                    </td>

                    <td>
                      <EduBadge level={stu.education_level || activeEducationLevel || 'Undergraduate'} size="sm" />
                    </td>

                    <td>
                      <div className="risk-meter-cell">
                        <div className="risk-meter-track">
                          <div
                            className={`risk-meter-fill ${
                              level === 'High'
                                ? 'risk-fill-high'
                                : level === 'Medium'
                                ? 'risk-fill-medium'
                                : 'risk-fill-low'
                            }`}
                            style={{ width: `${Math.min(riskPct, 100)}%` }}
                          />
                        </div>
                        <span className="risk-meter-label">{Number(riskPct).toFixed(1)}%</span>
                      </div>
                    </td>

                    <td>
                      <RiskBadge level={level} size="sm" />
                    </td>

                    <td>
                      <span
                        className={`prediction-tag ${
                          isAtRisk ? 'tag-at-risk' : 'tag-safe'
                        }`}
                      >
                        {stu.prediction}
                      </span>
                    </td>

                    <td>
                      <span className="text-sm text-secondary">
                        {level === 'High'
                          ? 'Priority Faculty Intervention'
                          : level === 'Medium'
                          ? 'Proactive Academic Monitoring'
                          : 'Standard Academic Schedule'}
                      </span>
                    </td>

                    <td className="text-right">
                      <button
                        type="button"
                        className="btn-link-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStudent(stu.student_id);
                        }}
                      >
                        <span>Analyze Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 action-arrow" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer-info">
        <span>
          Showing <strong>{filteredStudents.length}</strong> of{' '}
          <strong>{students.length}</strong> students in active cohort
        </span>
        <span className="footer-subtext">Click any student row to view full AI risk analysis</span>
      </div>
    </div>
  );
}
