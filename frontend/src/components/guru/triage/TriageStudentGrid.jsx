import React from 'react';
import { ChevronRight } from 'lucide-react';
import { getTriageBadgeInfo } from '../../../utils/triageHelpers';

export default function TriageStudentGrid({
  students,
  onOpenStudent
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
      {students.map((student) => {
        const badgeInfo = getTriageBadgeInfo(student.triage_level_expected);
        const isRed = student.triage_level_expected === 'MERAH';

        return (
          <div
            key={student.student_id}
            onClick={() => onOpenStudent(student)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--rounded-lg)',
              padding: '20px',
              border: `1.5px solid ${badgeInfo.borderColor}`,
              boxShadow: badgeInfo.shadow,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 180ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--colors-ink)', fontFamily: 'var(--font-mono)' }}>
                    {student.student_id}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--colors-steel)', background: '#f1f1f1', padding: '2px 6px', borderRadius: '4px' }}>
                    {student.grade_level}
                  </span>
                </div>

                <span
                  style={{
                    backgroundColor: badgeInfo.bg,
                    color: badgeInfo.color,
                    fontSize: '11.5px',
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: 'var(--rounded-full)'
                  }}
                >
                  {badgeInfo.label}
                </span>
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--colors-ink-tint)',
                  marginBottom: '14px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                "{student.reflection_text}"
              </div>

              <div style={{ fontSize: '12px', color: 'var(--colors-steel)', borderTop: '1px solid var(--colors-hairline-soft)', paddingTop: '10px' }}>
                <strong>Minat:</strong> {student.hobbies_interests}
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', color: student.attendance_trend?.includes('Alpa') ? '#c92a2a' : 'var(--colors-steel)', fontWeight: 500 }}>
                Absensi: {student.attendance_trend}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', color: 'var(--colors-primary)', fontWeight: 600 }}>
                Analisis Agen <ChevronRight size={14} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
