import type { Models } from './models.js';
import { postController } from './posts/controller.js';

export type Controllers = ReturnType<typeof initControllers>;

export const initControllers = ({ models }: { models: Models }) => {
  return {
    posts: postController({ models }),
  };
};
