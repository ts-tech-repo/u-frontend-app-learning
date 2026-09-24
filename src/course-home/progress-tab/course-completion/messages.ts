import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  donutLabel: {
    id: 'progress.completion.donut.label',
    defaultMessage: 'completed',
    description: 'Label text for progress donut chart',
  },
  completionBody: {
    id: 'progress.completion.body',
    defaultMessage: 'This represents how much of the course content you have completed. Note that some content may not yet be released.',
    description: 'It explains the meaning of progress donut chart',
  },
  completeContentTooltip: {
    id: 'progress.completion.tooltip.locked',
    defaultMessage: 'Content that you have completed.',
    description: 'It expalains the meaning of content that is completed',
  },
  courseCompletion: {
    id: 'progress.completion.header',
    defaultMessage: 'Course completion',
    description: 'Header text for (completion donut chart) section of the progress tab',
  },
  incompleteContentTooltip: {
    id: 'progress.completion.tooltip',
    defaultMessage: 'Content that you have access to and have not completed.',
    description: 'It explain the meaning for content is completed',
  },
  lockedContentTooltip: {
    id: 'progress.completion.tooltip.complete',
    defaultMessage: 'Content that is locked and available only to those who upgrade.',
    description: 'It expalains the meaning of content that is locked',
  },
  percentComplete: {
    id: 'progress.completion.donut.percentComplete',
    defaultMessage: 'You have completed {percent}% of content in this course.',
    description: 'It summarize the progress in the course (100% - %incomplete)',
  },
  percentIncomplete: {
    id: 'progress.completion.donut.percentIncomplete',
    defaultMessage: 'You have not completed {percent}% of content in this course that you have access to.',
    description: 'It summarize the progress in the course (100% - %complete)',
  },
  percentLocked: {
    id: 'progress.completion.donut.percentLocked',
    defaultMessage: '{percent}% of content in this course is locked and available only for those who upgrade.',
    description: 'It indicate the relative size of content that is locked in the course (100% - %open_content)',
  },
  certificateCriteria: {
    id: 'progress.courseCompletion.certificateCriteria',
    defaultMessage: '<b>Certificate Criteria:</b> Complete all {totalChecks} Knowledge Checks with at least {minimumScore} in each to qualify for the certificate.',
    description: 'Default message shown to the learner explaining what is required to unlock the certificate.',
  },
  certificateCongratulations: {
    id: 'progress.courseCompletion.certificateCongratulations',
    defaultMessage: 'Congratulations! You have met the requirements to earn your certificate.',
    description: 'Message shown to the learner when all knowledge checks are passed and the certificate is ready to be generated.',
  },
  certificateAlreadyGenerated: {
    id: 'progress.courseCompletion.certificateAlreadyGenerated',
    defaultMessage: 'Your certificate has already been generated.',
    description: 'Message shown to the learner when the certificate has already been generated and can be viewed.',
  },
  generateCertificate: {
    id: 'progress.courseCompletion.generateCertificate',
    defaultMessage: 'Generate Certificate',
    description: 'Button label that opens the survey/certificate flow in an iframe',
  },
  viewCertificate: {
    id: 'progress.courseCompletion.viewCertificate',
    defaultMessage: 'View Certificate',
    description: 'Button label shown instead of "Generate Certificate" once the certificate already exists',
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
  loading: {
    id: 'progress.courseCompletion.loading',
    defaultMessage: 'Loading',
    description: 'Screen-reader-only text for the spinner on the Generate/View Certificate button',
  },
});

export default messages;