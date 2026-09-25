import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';
import { DataTable } from '@openedx/paragon';
import { useContextId } from '../../../../data/hooks';

import { useModel } from '../../../../generic/model-store';
import messages from '../messages';
import SubsectionTitleCell from './SubsectionTitleCell';
import { showUngradedAssignments } from '../../utils';

const DetailedGradesTable = ({
  enableCustomCertificateView,
}) => {
  const intl = useIntl();
  const courseId = useContextId();

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const isLocaleRtl = isRtl(getLocale());
  return (
    sectionScores.map((chapter) => {
      const subsectionScores = chapter.subsections.filter(
        (subsection) => !!(
          (showUngradedAssignments() || subsection.hasGradedAssignment)
            && subsection.showGrades
            && (subsection.numPointsPossible > 0 || subsection.numPointsEarned > 0)
        ),
      );

      if (subsectionScores.length === 0) {
        return null;
      }

      const detailedGradesData = subsectionScores.map((subsection) => ({
        subsectionTitle: <SubsectionTitleCell subsection={subsection} />,
        score: <span className={subsection.learnerHasAccess ? '' : 'greyed-out'}>{subsection.numPointsEarned}{isLocaleRtl ? '\\' : '/'}{subsection.numPointsPossible}</span>,
        ...(enableCustomCertificateView && {
          scorePercent: <span className={subsection.learnerHasAccess ? '' : 'greyed-out'}>{`${(subsection.percentGraded * 100).toFixed(2).replace(/\.?0+$/, '')}%`}</span>,
        }),
      }));

      const columns = [
        {
          Header: chapter.displayName,
          accessor: 'subsectionTitle',
          headerClassName: 'h5 mb-0',
          cellClassName: 'mw-100',
        },
        {
          Header: `${intl.formatMessage(messages.score)}`,
          accessor: 'score',
          headerClassName: 'justify-content-end h5 mb-0',
          cellClassName: 'align-top text-right small',
        },
      ];

      if (enableCustomCertificateView) {
        columns.push({
          Header: `${intl.formatMessage(messages.scorePercent)}`,
          accessor: 'scorePercent',
          headerClassName: 'justify-content-end h5 mb-0',
          cellClassName: 'align-top text-right small',
        });
      }

      return (
        <div className="my-3" key={`${chapter.displayName}-grades-table`}>
          <DataTable
            data={detailedGradesData}
            itemCount={detailedGradesData.length}
            columns={columns}
          >
            <DataTable.Table />
          </DataTable>
        </div>
      );
    })
  );
};

DetailedGradesTable.propTypes = {
  enableCustomCertificateView: PropTypes.bool,
};

DetailedGradesTable.defaultProps = {
  enableCustomCertificateView: false,
};

export default DetailedGradesTable;
