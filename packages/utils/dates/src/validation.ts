import { dayjs } from './instance.ts';

// Not comprehensive obviously... can add to this over time as needed
const ACCEPTED_FORMATS = [
  'YYYY-MM',

  'YYYY-MM-DD',
  'YYYY_MM_DD',
  'YYYY.MM.DD',

  'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]', // ISO

  'YYYY/D/M',
  'YYYY/M/D',
  'D/M/YY',
  'M/D/YY',

  'YYYY-DD-MM',
  'DD-MM-YYYY',
  'MM-DD-YYYY',

  'YYYY/MM/DD',
  'YYYY/DD/MM',
  'DD/MM/YYYY',
  'MM/DD/YYYY',

  'YYYY-MM-DD hh:mm:ss',
  'YYYY-DD-MM hh:mm:ss',
  'DD-MM-YYYY hh:mm:ss',
  'MM-DD-YYYY hh:mm:ss',

  'YYYY.MM.DD.HHmm',
  'YYYY-MM-DD-HHmm',
  'YYYY-MM-DD_HHmm',
  'YYYY.MM.DD.HH.mm',
  'YYYY-MM-DD-HH-mm',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD h:mm A',
  'YYYY-MM-DD hh:mm A',
  'YYYY-MM-DD @ h:mm A',

  'YYYY.MM.DD.HHmmss',
  'YYYY-MM-DD-HHmmss',
  'YYYY-MM-DD_HHmmss',
  'YYYY-MM-DD_HHmm.ss',
  'YYYY.MM.DD.HH.mm.ss',
  'YYYY-MM-DD-HH-mm-ss',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD HH:mm.ss',
  'YYYY-MM-DD h:mm:ss A',
  'YYYY-MM-DD hh:mm:ss A',
  'YYYY-MM-DD @ h:mm:ss A',

  'X',
];

export const isValidDate = (maybeDate: unknown) => {
  if (!maybeDate) return false;

  return dayjs(maybeDate as any, ACCEPTED_FORMATS, true).isValid();
};
