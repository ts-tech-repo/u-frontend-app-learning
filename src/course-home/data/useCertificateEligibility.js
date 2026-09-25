import { useEffect, useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

/**
 * Fetches certificate eligibility status for the given course and exposes:
 * - isCheckingEligibility: true while the status request is in flight
 * - isEligible: whether the learner is eligible to generate/view a certificate
 * - isCompleted: whether the certificate has already been generated
 * - eligibilityDetails: raw eligibility payload (e.g. knowledge_checks)
 * - failedChecks: knowledge checks that have not been passed
 * - allChecksPassed: true only when every knowledge check has passed
 */
export default function useCertificateEligibility(courseId) {
  const ENABLE_CUSTOM_CERTIFICATE_VIEW = getConfig().ENABLE_CUSTOM_CERTIFICATE_VIEW;
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityDetails, setEligibilityDetails] = useState(null);

  if (!ENABLE_CUSTOM_CERTIFICATE_VIEW) {
    return {
      enableCustomCertificateView: false,
      isCheckingEligibility: false,
      isCompleted: false,
      isEligible: false,
      eligibilityDetails: null,
      failedChecks: [],
      allChecksPassed: false,
      totalKnowledgeChecks: null,
    };
  }

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
        setIsCompleted(Boolean(data && data.completed));
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

  const failedChecks = (eligibilityDetails?.knowledge_checks || [])
    .filter((check) => !check.passed);

  const allChecksPassed = failedChecks.length === 0;

  const totalKnowledgeChecks = eligibilityDetails?.knowledge_checks?.length || 0;

  return {
    enableCustomCertificateView: ENABLE_CUSTOM_CERTIFICATE_VIEW,
    isCheckingEligibility,
    isCompleted,
    isEligible,
    eligibilityDetails,
    failedChecks,
    allChecksPassed,
    totalKnowledgeChecks,
  };
}
