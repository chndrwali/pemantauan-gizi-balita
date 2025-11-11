import { currentUser } from '@/actions/auth-server';
import { LoginForm } from '@/components/features/auth/login-form';
import { redirectMap } from '@/lib/utils';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

const Page = async () => {
  const user = await currentUser();

  if (user) {
    const to = redirectMap[user.role] ?? '/';
    redirect(to);
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
