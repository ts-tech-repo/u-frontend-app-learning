import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, ModalDialog, Spinner,
} from '@openedx/paragon';

import CompletionDonutChart from './CompletionDonutChart';
import messages from './messages';

const CourseCompletion = ({ courseId: courseIdProp }) => {
  const intl = useIntl();
  const { courseId: courseIdFromRoute } = useParams();
  const courseId = courseIdProp || courseIdFromRoute;

  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityDetails, setEligibilityDetails] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkEligibility() {
      if (!courseId) {
        setIsCheckingEligibility(false);
        return;
      }

      try {
        const statusUrl = `${getConfig().LMS_BASE_URL}/extras/certificate/status/`;

        const { data } = await getAuthenticatedHttpClient().get(statusUrl, {
          params: { course_id: courseId },
        });

        if (!isMounted) {
          return;
        }

        setIsEligible(Boolean(data && data.eligible));
        setEligibilityDetails(data ? data.eligibility : null);
      } catch (err) {
        if (isMounted) {
          setIsEligible(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingEligibility(false);
        }
      }
    }

    checkEligibility();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleGenerateCertificate = useCallback(() => {
    setError(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== getConfig().LMS_BASE_URL) {
        return;
      }
      if (event.data && event.data.type === 'certificate-flow:close') {
        setIsModalOpen(false);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const certificateWizardUrl = courseId
    ? `${getConfig().LMS_BASE_URL}/extras/certificate/generate/?course_id=${encodeURIComponent(courseId)}`
    : null;

  const failedChecks = (eligibilityDetails?.knowledge_checks || [])
    .filter((check) => !check.passed);

  return (
    <section className="text-dark-700 mb-4 rounded raised-card p-4 bg-white">
      {/* Inject custom styles for the modal to guarantee dimensions, centering, and z-index */}
      <style>{`
        .certificate-modal-wrapper {
          z-index: 999999 !important;
        }
        .certificate-modal-wrapper .modal-backdrop {
          z-index: 999998 !important;
        }
        .certificate-modal-wrapper .modal-dialog {
          max-width: 90% !important;
          width: 90% !important;
          height: 90vh !important;
          max-height: 90vh !important;
          margin: 0 auto !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .certificate-modal-wrapper .modal-content {
          height: 100% !important;
          width: 100% !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .certificate-modal-wrapper .modal-body {
          height: 100% !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          position: relative !important;
        }
        .certificate-custom-close {
          position: absolute !important;
          top: -40px !important;
          right: 0 !important;
          background: white !important;
          border-radius: 50% !important;
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          z-index: 1000000 !important;
          border: 1px solid #dee2e6 !important;
          color: #495057 !important;
          font-size: 18px !important;
          transition: all 0.2s ease !important;
        }
        .certificate-custom-close:hover {
          background: #f8f9fa !important;
          color: #000 !important;
        }
      `}</style>

      <div className="row w-100 m-0">
        <div className="col-12 col-sm-6 col-md-7 p-0">
          <h2>{intl.formatMessage(messages.courseCompletion)}</h2>
          <p className="small">
            {intl.formatMessage(messages.completionBody)}
          </p>

          {isCheckingEligibility ? (
            <Button
              variant="outline-primary"
              className="mt-2"
              disabled
            >
              <Spinner
                animation="border"
                size="sm"
                className="mr-2"
                screenReaderText={intl.formatMessage(messages.loading)}
              />
              {intl.formatMessage(messages.checkingEligibility)}
            </Button>
          ) : (
            isEligible && (
              <Button
                variant="outline-primary"
                className="mt-2"
                onClick={handleGenerateCertificate}
              >
                {intl.formatMessage(messages.generateCertificate)}
              </Button>
            )
          )}

          {!isCheckingEligibility && !isEligible && (
            <p className="small text-muted mt-2">
              {failedChecks.length > 0
                ? intl.formatMessage(messages.certificateLocked, {
                  minScore: Math.round(
                    (eligibilityDetails?.minimum_score || 0.6) * 100,
                  ),
                })
                : intl.formatMessage(messages.certificateNotYetAvailable)}
            </p>
          )}

          {error && (
            <p className="small text-danger mt-2" role="alert">
              {error}
            </p>
          )}
        </div>
        <div className="col-12 col-sm-6 col-md-5 mt-sm-n3 p-0 text-center">
          <CompletionDonutChart />
        </div>
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="certificate-modal-wrapper"
        hasCloseButton={false} // Disabled default header/close button to ensure "no header"
      >
        <ModalDialog.Body>
          {/* Custom close button since we removed the header */}
          <button 
            className="certificate-custom-close" 
            onClick={handleCloseModal}
            aria-label="Close certificate modal"
            type="button"
          >
            ✕
          </button>

          {certificateWizardUrl && (
            <iframe
              title={intl.formatMessage(messages.certificateModalTitle)}
              src={certificateWizardUrl}
              className="border-0 rounded"
              style={{ 
                width: '100%', 
                height: '100%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                backgroundColor: '#ffffff'
              }}
            />
          )}
        </ModalDialog.Body>
      </ModalDialog>
    </section>
  );
};

CourseCompletion.propTypes = {
  courseId: PropTypes.string,
};

CourseCompletion.defaultProps = {
  courseId: null,
};

export default CourseCompletion;