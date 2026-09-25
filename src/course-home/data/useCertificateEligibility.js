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
  const [enableCustomCertificateView, setEnableCustomCertificateView] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityDetails, setEligibilityDetails] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkCertificate() {
      if (!courseId) {
        setIsCheckingEligibility(false);
        return;
      }

      try {
        const lmsBaseUrl = getConfig().LMS_BASE_URL;

        // Check course-level certificate setting
        const enabledUrl = `${lmsBaseUrl}/extras/certificate/enabled/`;

        const { data: enabledData } =
          await getAuthenticatedHttpClient().get(enabledUrl, {
            params: { course_id: courseId },
          });

        if (!isMounted) {
          return;
        }

        const enabled = Boolean(enabledData?.enabled);

        setEnableCustomCertificateView(enabled);

        // Do not check certificate eligibility if disabled for this course.
        if (!enabled) {
          setIsCheckingEligibility(false);
          setIsEligible(false);
          setIsCompleted(false);
          setEligibilityDetails(null);
          return;
        }

        // Existing eligibility check
        const statusUrl = `${lmsBaseUrl}/extras/certificate/status/`;

        const { data } = await getAuthenticatedHttpClient().get(statusUrl, {
          params: { course_id: courseId },
        });

        if (!isMounted) {
          return;
        }

        setIsEligible(Boolean(data?.eligible));
        setEligibilityDetails(data?.eligibility || null);
        setIsCompleted(Boolean(data?.completed));
      } catch (err) {
        if (isMounted) {
          setEnableCustomCertificateView(false);
          setIsEligible(false);
          setIsCompleted(false);
          setEligibilityDetails(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingEligibility(false);
        }
      }
    }

    checkCertificate();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const failedChecks = (eligibilityDetails?.knowledge_checks || [])
    .filter((check) => !check.passed);

  const allChecksPassed = failedChecks.length === 0;

  const totalKnowledgeChecks = eligibilityDetails?.knowledge_checks?.length || 0;

  return {
    enableCustomCertificateView,
    isCheckingEligibility,
    isCompleted,
    isEligible,
    eligibilityDetails,
    failedChecks,
    allChecksPassed,
    totalKnowledgeChecks,
  };
}
