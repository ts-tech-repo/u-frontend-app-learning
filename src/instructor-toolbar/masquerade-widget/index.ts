import { MasqueradeWidget } from './MasqueradeWidget';

export default MasqueradeWidget;

export interface MasqueradeError {
  message: string;
  link?: string;
  linkText?: string;
}