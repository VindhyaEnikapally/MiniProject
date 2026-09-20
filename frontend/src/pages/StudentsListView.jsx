import React from 'react';
import { StudentRiskTable } from '../components/students/StudentRiskTable';

export function StudentsListView({ onSelectStudent }) {
  return (
    <div className="students-list-page">
      <StudentRiskTable onSelectStudent={onSelectStudent} />
    </div>
  );
}
