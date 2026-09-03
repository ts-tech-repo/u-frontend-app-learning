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
    defaultMessage: 'Score {minScore}% to unlock your certificate.',
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
