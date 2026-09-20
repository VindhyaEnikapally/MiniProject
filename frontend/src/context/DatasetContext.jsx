import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '../api/analyticsApi';

const DatasetContext = createContext(null);

const RECENT_DATASETS_KEY = 'ssp_recent_datasets';
const ACTIVE_DATASET_KEY = 'ssp_active_dataset_id';

// Default initial dataset id from existing upload
const INITIAL_DATASET_ID = 'dff89e2eaa00';

export function DatasetProvider({ children }) {
  const [activeDatasetId, setActiveDatasetId] = useState(() => {
    return localStorage.getItem(ACTIVE_DATASET_KEY) || INITIAL_DATASET_ID;
  });

  const [activeDatasetName, setActiveDatasetName] = useState(() => {
    return localStorage.getItem('ssp_active_dataset_name') || 'sample_students_100.csv';
  });

  const [activeEducationLevel, setActiveEducationLevel] = useState(() => {
    return localStorage.getItem('ssp_active_education_level') || '';
  });

  const [recentDatasets, setRecentDatasets] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_DATASETS_KEY);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'dff89e2eaa00',
          name: 'sample_students_100.csv',
          educationLevel: 'Undergraduate',
          uploadedAt: new Date().toISOString(),
          totalStudents: 100,
          atRiskStudents: 18,
          atRiskPercentage: 18.0,
        },
      ];
    } catch {
      return [];
    }
  });

  const [analytics, setAnalytics] = useState(null);
  const [topRiskStudents, setTopRiskStudents] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Persist recent datasets
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_DATASETS_KEY, JSON.stringify(recentDatasets));
    } catch (e) {
      console.warn('Failed to persist recent datasets', e);
    }
  }, [recentDatasets]);

  // Persist active dataset
  useEffect(() => {
    if (activeDatasetId) {
      localStorage.setItem(ACTIVE_DATASET_KEY, activeDatasetId);
      localStorage.setItem('ssp_active_dataset_name', activeDatasetName);
      if (activeEducationLevel) {
        localStorage.setItem('ssp_active_education_level', activeEducationLevel);
      }
    }
  }, [activeDatasetId, activeDatasetName, activeEducationLevel]);

  // Fetch dashboard analytics for the active dataset
  const loadAnalytics = useCallback(async (datasetId) => {
    if (!datasetId) {
      setAnalytics(null);
      setTopRiskStudents([]);
      return;
    }

    setLoadingAnalytics(true);
    setAnalyticsError(null);

    try {
      const [dashRes, topRes] = await Promise.allSettled([
        analyticsApi.getDashboardAnalytics(datasetId),
        analyticsApi.getTopRiskStudents(datasetId, 10),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.success) {
        setAnalytics(dashRes.value.analytics);
        const serverEdu = dashRes.value.analytics?.overview?.education_level;
        if (serverEdu) {
          setActiveEducationLevel((prev) => prev || serverEdu);
        }
      } else if (dashRes.status === 'rejected') {
        throw dashRes.reason;
      }

      if (topRes.status === 'fulfilled' && topRes.value.success) {
        const list = topRes.value.students || [];
        setTopRiskStudents(list);
        setSelectedStudentId((prev) => prev || (list[0]?.student_id || null));
      } else if (dashRes.status === 'fulfilled' && dashRes.value.analytics?.top_risk_students) {
        const list = dashRes.value.analytics.top_risk_students;
        setTopRiskStudents(list);
        setSelectedStudentId((prev) => prev || (list[0]?.student_id || null));
      }
    } catch (err) {
      console.error('Error fetching analytics for dataset:', datasetId, err);
      setAnalyticsError(err.message || 'Failed to load dataset analytics.');
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    if (activeDatasetId) {
      loadAnalytics(activeDatasetId);
    }
  }, [activeDatasetId, loadAnalytics]);

  // Register a newly predicted dataset
  const recordNewDataset = ({ datasetId, fileName, educationLevel, analyticsResult, topRiskList }) => {
    setActiveDatasetId(datasetId);
    setActiveDatasetName(fileName);
    if (educationLevel) {
      setActiveEducationLevel(educationLevel);
      localStorage.setItem('ssp_active_education_level', educationLevel);
    }

    const newRecord = {
      id: datasetId,
      name: fileName,
      educationLevel: educationLevel || analyticsResult?.education_level || '',
      uploadedAt: new Date().toISOString(),
      totalStudents: analyticsResult?.total_students || 0,
      atRiskStudents: analyticsResult?.at_risk_students || 0,
      atRiskPercentage: analyticsResult?.at_risk_percentage || 0,
    };

    setRecentDatasets((prev) => {
      const filtered = prev.filter((d) => d.id !== datasetId);
      return [newRecord, ...filtered].slice(0, 10);
    });

    if (analyticsResult) {
      setAnalytics((prev) => ({
        ...prev,
        overview: {
          total_students: analyticsResult.total_students,
          at_risk_students: analyticsResult.at_risk_students,
          not_at_risk_students: analyticsResult.not_at_risk_students,
          at_risk_percentage: analyticsResult.at_risk_percentage,
          average_risk_percentage: (analyticsResult.average_risk || 0) * 100,
          average_risk_probability: analyticsResult.average_risk || 0,
        },
        average_risk: analyticsResult.average_risk,
      }));
    }

    if (topRiskList) {
      setTopRiskStudents(topRiskList);
    }

    // Refresh complete analytics from backend to get risk distribution
    loadAnalytics(datasetId);
  };

  const switchDataset = (datasetId, datasetName, educationLevel) => {
    setActiveDatasetId(datasetId);
    if (datasetName) setActiveDatasetName(datasetName);
    if (educationLevel) {
      setActiveEducationLevel(educationLevel);
    } else {
      const match = recentDatasets.find((d) => d.id === datasetId);
      if (match?.educationLevel) {
        setActiveEducationLevel(match.educationLevel);
      }
    }
    setSelectedStudentId(null);
  };

  return (
    <DatasetContext.Provider
      value={{
        activeDatasetId,
        activeDatasetName,
        activeEducationLevel,
        setActiveEducationLevel,
        recentDatasets,
        analytics,
        topRiskStudents,
        loadingAnalytics,
        analyticsError,
        selectedStudentId,
        setSelectedStudentId,
        switchDataset,
        recordNewDataset,
        refreshAnalytics: () => loadAnalytics(activeDatasetId),
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}
