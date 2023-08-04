'use client';

import type { InsertablePost, Post } from '@libs/db-model/schema';
import { insertPostSchema } from '@libs/db-model/schema';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createPost } from '~/lib/actions/posts.ts';
import { usePathname, useRouter } from 'next/navigation';

export const AddPostForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  const methods = useForm<InsertablePost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit: SubmitHandler<InsertablePost> = async data => {
    const res = await createPost({ data, path: pathname });

    methods.reset();

    router.refresh();
    router.push(`/posts/${res.id}`);
  };

  const submitElem = (
    <button type="submit" disabled={methods.formState.isSubmitting} className="mr-2">
      {methods.formState.isSubmitting ? 'Adding...' : 'Add Post'}
    </button>
  );

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <Controller control={methods.control} name="title" render={({ field }) => <input {...field} />} />

      {submitElem}
    </form>
  );

  // const submitElem = (
  //   <Button type="submit" variant="solid" disabled={methods.formState.isSubmitting} tw="mr-2">
  //     {methods.formState.isSubmitting ? 'Adding...' : 'Add Post'}
  //   </Button>
  // );

  // return (
  //   <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
  //     <FormInputField
  //       control={methods.control}
  //       name="title"
  //       inputProps={{ variant: 'ghost', size: 'lg', placeholder: 'New post title...', endSection: submitElem }}
  //     />
  //   </Form>
  // );
};
