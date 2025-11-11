// import { AlertRegister } from '@/components/features/auth/alert-register';
import { currentUser } from '@/actions/auth-server';
import { RegisterForm } from '@/components/features/auth/register-form';
import { redirectMap } from '@/lib/utils';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Daftar',
};

export default async function Page() {
  const user = await currentUser();

  if (user) {
    const to = redirectMap[user.role] ?? '/';
    redirect(to);
  }

  return (
    <div className="p-6 md:p-10">
      {/* <AlertRegister /> */}
      <RegisterForm />
    </div>
  );
}
