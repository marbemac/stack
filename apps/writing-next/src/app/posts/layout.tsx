import { Box } from '@marbemac/ui-primitives-react';
import type { ReactNode } from 'react';

import { AddPostForm } from '~/components/forms/AddPostForm.tsx';
import { NavLink } from '~/components/NavLink.tsx';
import { listPosts } from '~/lib/fetchers/posts.ts';

export const dynamic = 'force-dynamic';

export default async function PostsLayout({ children }: { children: ReactNode }) {
  console.log('PostsLayout.render');

  return (
    <Box tw="flex min-h-screen w-full divide-x">
      <Box tw="flex flex-1 flex-col divide-y">
        <AddPostForm />

        <PostsList />
      </Box>

      <Box tw="flex-1">{children}</Box>
    </Box>
  );
}

const PostsList = async () => {
  console.log('PostsList.render');

  const posts = await listPosts();

  if (!posts.length) {
    return <div className="py-24 text-center text-fg-muted">No posts... add one above</div>;
  }

  return (
    <div className="divide-y">
      {posts.map(post => {
        return (
          <NavLink
            key={post.id}
            href={`/posts/${post.id}`}
            tw="flex items-center p-4"
            twInactive="hover:bg-neutral-soft"
            twActive="bg-primary-soft"
            activeProps={{
              href: '/posts',
            }}
          >
            <Box tw="flex-1 font-medium">{post.title}</Box>
            {post.isDraft ? <Box tw="rounded border px-1 py-0.5 text-xs uppercase text-muted">draft</Box> : null}
          </NavLink>
        );
      })}
    </div>
  );
};

// const AddPostForm = () => {
//   async function createPost(data) {
//     'use server';

//     // const cartId = cookies().get('cartId')?.value
//     // await saveToDb({ cartId, data })
//     console.log('action.createPost', data);

//     await new Promise(r => setTimeout(r, 2000));
//   }

//   return (
//     <form action={createPost}>
//       <SubmitButton />
//     </form>
//   );
// };

// const AddPostForm = (props: { onSuccess?: (res: TrpcRouterOutput['posts']['create']) => void }) => {
//   const createPost = useTrpc().posts.create.useMutation();

//   const methods = useForm<InsertablePost>({
//     resolver: zodResolver(insertPostSchema),
//     defaultValues: {
//       title: '',
//     },
//   });

//   const onSubmit: SubmitHandler<InsertablePost> = async data => {
//     const res = await createPost.mutateAsync(data);

//     methods.reset();

//     if (props.onSuccess) {
//       props.onSuccess(res);
//     }
//   };

//   const submitElem = (
//     <Button type="submit" variant="solid" disabled={methods.formState.isSubmitting} tw="mr-2">
//       {methods.formState.isSubmitting ? 'Adding...' : 'Add Post'}
//     </Button>
//   );

//   return (
//     <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
//       <FormInputField
//         control={methods.control}
//         name="title"
//         inputProps={{ variant: 'ghost', size: 'lg', placeholder: 'New post title...', endSection: submitElem }}
//       />
//     </Form>
//   );
// };
