import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, ModalDialog,
} from '@openedx/paragon';

import useCertificateEligibility from '../../data/useCertificateEligibility';
import messages from './messages';

const CourseCompletionCertificate = ({ courseId: courseIdProp }) => {
  const intl = useIntl();
  const { courseId: courseIdFromRoute } = useParams();
  const courseId = courseIdProp || courseIdFromRoute;

  const {
    isCheckingEligibility,
    isCompleted,
    isEligible,
    allChecksPassed,
  } = useCertificateEligibility(courseId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateCertificate = useCallback(() => {
    setError(null);

    setIsModalOpen(true);
  }, [hideGradeTooltips]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [showGradeTooltips]);

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== getConfig().LMS_BASE_URL) {
        return;
      }
      if (event.data && event.data.type === 'certificate-flow:close') {
        handleCloseModal();
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleCloseModal]);

  const certificateWizardUrl = courseId
    ? `${getConfig().LMS_BASE_URL}/extras/certificate/generate/?course_id=${encodeURIComponent(courseId)}`
    : null;

  return (
    <section className="text-dark-700 mb-4 rounded raised-card p-4 bg-white">
      <div className="row w-100 m-0">
        <div className="p-0">
          {!isCheckingEligibility && isEligible && allChecksPassed && (
            <>
              {/* Congratulatory / status message */}
              <strong
                className="___1qwroh2 fl43uef f19n0e5 d-block"
                data-lexical-text="true"
              >
                {isCompleted
                  ? intl.formatMessage(messages.certificateAlreadyGenerated)
                  : intl.formatMessage(messages.certificateCongratulations)}
              </strong>

              <Button
                variant="outline-primary"
                className="mt-2"
                onClick={handleGenerateCertificate}
              >
                {isCompleted ? intl.formatMessage(messages.viewCertificate) : intl.formatMessage(messages.generateCertificate)}
              </Button>
            </>
          )}
          {error && (
            <p className="small text-danger mt-2" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

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
            ✕
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
    </section>
  );
};

CourseCompletionCertificate.propTypes = {
  courseId: PropTypes.string,
};

CourseCompletionCertificate.defaultProps = {
  courseId: null,
};

export default CourseCompletionCertificate;