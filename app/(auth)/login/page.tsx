import { LoginForm } from '@/components/features/auth/login-form';
import { requireUnauth } from '@/lib/auth-utils';

const Page = async () => {
  await requireUnauth();

  return (
    <div className="bg-muted flex min-h-svh flex-col justify-center items-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
