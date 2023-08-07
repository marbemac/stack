'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { InsertablePost, Post } from '@libs/db-model/schema';
import { insertPostSchema } from '@libs/db-model/schema';
import { Button } from '@marbemac/ui-primitives-react';
import { usePathname, useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, Form, useForm } from 'react-hook-form';

import { createPost } from '~/lib/actions/posts.ts';

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
    <Button type="submit" disabled={methods.formState.isSubmitting} tw="mr-2" variant="solid">
      {methods.formState.isSubmitting ? 'Adding...' : 'Add Post'}
    </Button>
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
