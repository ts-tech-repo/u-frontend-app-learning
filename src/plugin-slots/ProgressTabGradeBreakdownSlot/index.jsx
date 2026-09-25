import { useModel } from '@src/generic/model-store';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import React from 'react';
import PropTypes from 'prop-types';
import DetailedGrades from '../../course-home/progress-tab/grades/detailed-grades/DetailedGrades';
import GradeSummary from '../../course-home/progress-tab/grades/grade-summary/GradeSummary';
import { useContextId } from '../../data/hooks';

const ProgressTabGradeBreakdownSlot = ({
  enableCustomCertificateView,
}) => {
  const courseId = useContextId();
  const { gradesFeatureIsFullyLocked } = useModel('progress', courseId);
  const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';
  return (
    <PluginSlot
      id="org.openedx.frontend.learning.progress_tab_grade_breakdown.v1"
      idAliases={['progress_tab_grade_breakdown_slot']}
    >
      <div
        className={`grades my-4 p-4 rounded raised-card bg-white ${applyLockedOverlay}`}
        aria-hidden={gradesFeatureIsFullyLocked}
      >
        {!enableCustomCertificateView && <GradeSummary /> }
        <DetailedGrades enableCustomCertificateView={enableCustomCertificateView} />
      </div>
    </PluginSlot>
  );
};

ProgressTabGradeBreakdownSlot.propTypes = {
  enableCustomCertificateView: PropTypes.bool,
};

ProgressTabGradeBreakdownSlot.defaultProps = {
  enableCustomCertificateView: false,
};

export default ProgressTabGradeBreakdownSlot;
