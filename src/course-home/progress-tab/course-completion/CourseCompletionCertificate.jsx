import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, ModalDialog, Spinner } from '@openedx/paragon';

import messages from './messages';

const CourseCompletionCertificate = ({
  courseId: courseIdProp,
  isCheckingEligibility,
  isEligible,
  allChecksPassed,
  eligibilityDetails,
  isCompleted,
  totalKnowledgeChecks,
}) => {
  const intl = useIntl();
  const { courseId: courseIdFromRoute } = useParams();
  const courseId = courseIdProp || courseIdFromRoute;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateCertificate = useCallback(() => {
    setError(null);

    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== getConfig().LMS_BASE_URL) {
        return;
      }
      if (event.data?.type === 'certificate-flow:close') {
        handleCloseModal();
      }
      if (event.data?.type === 'certificate-flow:error') {
        setError(event.data.message || null);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleCloseModal]);

  const certificateWizardUrl = courseId
    ? `${getConfig().LMS_BASE_URL}/extras/certificate/generate/?course_id=${encodeURIComponent(courseId)}`
    : null;

  const minimumScore = eligibilityDetails?.minimum_score;

  const formattedMinimumScore = intl.formatNumber(minimumScore ?? 0.6, {
    style: 'percent',
    maximumFractionDigits: 2,
  });

  // Certificate is "qualified" once every knowledge check has been passed
  // and the eligibility check has confirmed it, but it hasn't been generated yet.
  const isQualified = isEligible && allChecksPassed && !isCompleted;
  // The button is only actionable once eligibility has finished checking and
  // the learner is either qualified to generate one, or already has one to view.
  const isButtonDisabled = isCheckingEligibility || !(isQualified || isCompleted);

  let statusMessage;
  if (isCompleted) {
    statusMessage = intl.formatMessage(messages.certificateAlreadyGenerated);
  } else if (isQualified) {
    statusMessage = intl.formatMessage(messages.certificateCongratulations);
  } else {
    statusMessage = intl.formatMessage(messages.certificateCriteria, {
      totalChecks: totalKnowledgeChecks,
      minimumScore: formattedMinimumScore,
      b: (chunks) => <strong>{chunks}</strong>,
    });
  }

  let buttonLabel;
  if (isCheckingEligibility) {
    buttonLabel = (
      <>
        <Spinner
          animation="border"
          size="sm"
          className="mr-2"
          screenReaderText={intl.formatMessage(messages.loading)}
        />
        {intl.formatMessage(messages.checkingEligibility)}
      </>
    );
  } else if (isCompleted) {
    buttonLabel = intl.formatMessage(messages.viewCertificate);
  } else {
    buttonLabel = intl.formatMessage(messages.generateCertificate);
  }

  return (
    <>
      <section className="text-dark-700 mb-4 rounded raised-card p-4 bg-white">
        <p className="mb-3">{statusMessage}</p>

        <Button
          variant={isCompleted ? 'outline-primary' : 'primary'}
          disabled={isButtonDisabled}
          onClick={handleGenerateCertificate}
        >
          {buttonLabel}
        </Button>

        {error && (
          <p className="small text-danger mt-2" role="alert">
            {error}
          </p>
        )}
      </section>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="certificate-modal-wrapper"
        hasCloseButton={false}
      >
        <ModalDialog.Body className="certificate-modal-body">
          <button
            type="button"
            className="certificate-custom-close"
            onClick={handleCloseModal}
            aria-label="Close certificate modal"
          >
            {/* Close Icon Unicode (x) */}
            &#10005; 
          </button>

          {certificateWizardUrl && (
            <iframe
              title={intl.formatMessage(messages.certificateModalTitle)}
              src={certificateWizardUrl}
              className="certificate-iframe"
            />
          )}
        </ModalDialog.Body>
      </ModalDialog>
    </>
  );
};

CourseCompletionCertificate.propTypes = {
  courseId: PropTypes.string,
  isCheckingEligibility: PropTypes.bool,
  isEligible: PropTypes.bool,
  allChecksPassed: PropTypes.bool,
  isCompleted: PropTypes.bool,
  eligibilityDetails: PropTypes.shape({
    minimum_score: PropTypes.number,
    total_checks: PropTypes.number,
  }),
  totalKnowledgeChecks: PropTypes.number,
};

CourseCompletionCertificate.defaultProps = {
  courseId: null,
  isCheckingEligibility: false,
  isEligible: false,
  allChecksPassed: false,
  isCompleted: false,
  eligibilityDetails: null,
  totalKnowledgeChecks: null,
};

export default CourseCompletionCertificate;