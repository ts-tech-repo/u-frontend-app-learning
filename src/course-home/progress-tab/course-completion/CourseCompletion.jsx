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

  /**
   * Hide the grade tooltips while the certificate modal is open.
   */
  const hideGradeTooltips = useCallback(() => {
    const nonPassingGradeTooltip = $('#non-passing-grade-tooltip');
    const minimumGradeTooltip = $('#minimum-grade-tooltip');

    if (nonPassingGradeTooltip.length && !nonPassingGradeTooltip.hasClass('d-none')) {
      nonPassingGradeTooltip.addClass('d-none');
    }

    if (minimumGradeTooltip.length && !minimumGradeTooltip.hasClass('d-none')) {
      minimumGradeTooltip.addClass('d-none');
    }
  }, []);

  /**
   * Restore the grade tooltips after the certificate modal closes.
   */
  const showGradeTooltips = useCallback(() => {
    const nonPassingGradeTooltip = $('#non-passing-grade-tooltip');
    const minimumGradeTooltip = $('#minimum-grade-tooltip');

    if (nonPassingGradeTooltip.length && nonPassingGradeTooltip.hasClass('d-none')) {
      nonPassingGradeTooltip.removeClass('d-none');
    }

    if (minimumGradeTooltip.length && minimumGradeTooltip.hasClass('d-none')) {
      minimumGradeTooltip.removeClass('d-none');
    }
  }, []);

  const handleGenerateCertificate = useCallback(() => {
    setError(null);

    hideGradeTooltips();
    setIsModalOpen(true);
  }, [hideGradeTooltips]);

  const handleCloseModal = useCallback(() => {
    showGradeTooltips();
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

  const failedChecks = (eligibilityDetails?.knowledge_checks || [])
    .filter((check) => !check.passed);

  return (
    <section className="text-dark-700 mb-4 rounded raised-card p-4 bg-white">
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

CourseCompletion.propTypes = {
  courseId: PropTypes.string,
};

CourseCompletion.defaultProps = {
  courseId: null,
};

export default CourseCompletion;