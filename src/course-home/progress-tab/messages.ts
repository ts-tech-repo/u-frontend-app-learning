import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  progressHeader: {
    id: 'progress.header',
    defaultMessage: 'Your progress',
    description: 'Headline or title for the progress tab',
  },
  progressHeaderForTargetUser: {
    id: 'progress.header.targetUser',
    defaultMessage: 'Course progress for {username}',
    description: 'Header when displaying the progress for a different user',
  },
  studioLink: {
    id: 'progress.link.studio',
    defaultMessage: 'View grading in Studio',
    description: 'Text shown for button that redirects to the studio if the user is a staff memember',
  },
  generateCertificate: {
    id: 'progress.courseCompletion.generateCertificate',
    defaultMessage: 'Generate Certificate',
    description: 'Button label that opens the survey/certificate flow in an iframe',
  },
  checkingEligibility: {
    id: 'progress.courseCompletion.checkingEligibility',
    defaultMessage: 'Checking...',
    description: 'Label shown on the button while eligibility is being checked on load',
  },
  certificateModalTitle: {
    id: 'progress.courseCompletion.certificateModalTitle',
    defaultMessage: 'Your Certificate',
    description: 'Title of the modal dialog that displays the survey/certificate iframe',
  },
  certificateLocked: {
    id: 'progress.courseCompletion.certificateLocked',
    defaultMessage: 'Score {minScore}% or higher on every Knowledge Check to unlock your certificate.',
    description: 'Shown under the disabled button when one or more Knowledge Checks are below the passing score',
  },
  certificateNotYetAvailable: {
    id: 'progress.courseCompletion.certificateNotYetAvailable',
    defaultMessage: 'Your certificate is not available yet.',
    description: 'Shown under the disabled button when eligibility could not be confirmed',
  },
  loading: {
    id: 'progress.courseCompletion.loading',
    defaultMessage: 'Loading',
    description: 'Screen-reader-only text for the spinner on the Generate Certificate button',
  },
});

export default messages;
