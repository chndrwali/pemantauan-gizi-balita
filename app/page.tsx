import { caller } from '@/trpc/server';

const Page = async () => {
  const users = await caller.getUsers();
  return <div>{JSON.stringify(users)}</div>;
};

export default Page;
