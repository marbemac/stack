'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={pending ? 'button-pending' : 'button-normal'} disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
};
