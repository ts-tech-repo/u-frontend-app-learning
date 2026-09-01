import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, ModalDialog, Spinner,
} from '@edx/paragon';

import CompletionDonutChart from './CompletionDonutChart';
import messages from './messages';

const CourseCompletion = ({ courseId: courseIdProp }) => {
  const intl = useIntl();
  const { courseId: courseIdFromRoute } = useParams();
  const courseId = courseIdProp || courseIdFromRoute;

  // Eligibility (60%+ on every Knowledge Check) — checked once on
  // mount so the button is disabled/hidden until we know the answer,
  // per PRD 2.1.
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
    // The wizard page checks status itself on load — if this learner
    // already submitted/skipped the survey, it jumps straight to the
    // Certificate step (PRD 2.4) without us needing extra logic here.
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // The wizard's "Back to Dashboard" buttons postMessage this when
  // running inside an iframe, so we can close the modal instead of it
  // trying (and failing) to navigate the whole iframe away.
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

  // A short, non-technical summary of why the button is disabled —
  // e.g. "Score 60%+ on every Knowledge Check to unlock your certificate."
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

          <Button
            variant="outline-primary"
            className="mt-2"
            onClick={handleGenerateCertificate}
            disabled={isCheckingEligibility || !isEligible || !courseId}
          >
            {isCheckingEligibility ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="mr-2"
                  screenReaderText={intl.formatMessage(messages.loading)}
                />
                {intl.formatMessage(messages.checkingEligibility)}
              </>
            ) : (
              intl.formatMessage(messages.generateCertificate)
            )}
          </Button>

          {!isCheckingEligibility && !isEligible && (
            <p className="small text-muted mt-2">
              {failedChecks.length > 0
                ? intl.formatMessage(messages.certificateLocked, {
                  minScore: Math.round((eligibilityDetails?.minimum_score || 0.6) * 100),
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
        title={intl.formatMessage(messages.certificateModalTitle)}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="fullscreen"
        hasCloseButton
        isFullscreenScroll
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {intl.formatMessage(messages.certificateModalTitle)}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body className="p-0">
          {certificateWizardUrl && (
            <iframe
              title={intl.formatMessage(messages.certificateModalTitle)}
              src={certificateWizardUrl}
              className="w-100 border-0"
              style={{ height: '85vh' }}
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