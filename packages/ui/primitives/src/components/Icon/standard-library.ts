import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCopy,
  faDatabase,
  faExclamationCircle,
  faExclamationTriangle,
  faExpandArrowsAlt,
  faExternalLinkAlt,
  faHouse,
  faInfoCircle,
  faLink,
  faPlay,
  faPlus,
  faSort,
  faSpinner,
  faStop,
  faStream,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

let addedToLibrary = false;
export const initLibrary = (): void => {
  if (addedToLibrary) return;

  /**
   * So that if Icon is imported, the library stuff is not tree-shaken out. If `library.add` was hoisted out of this
   * function then it would be shaken out at consumer build time.
   */
  library.add(
    faCaretDown,
    faCaretLeft,
    faCaretRight,
    faHouse,
    faDatabase,
    faArrowLeft,
    faCaretUp,
    faCheck,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faStop,
    faPlay,
    faCopy,
    faExclamationCircle,
    faSpinner,
    faExclamationTriangle,
    faExpandArrowsAlt,
    faExternalLinkAlt,
    faInfoCircle,
    faLink,
    faPlus,
    faSort,
    faStream,
    faUser,
  );

  addedToLibrary = true;
};
