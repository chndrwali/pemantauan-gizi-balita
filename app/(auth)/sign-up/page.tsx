// import { AlertRegister } from '@/components/features/auth/alert-register';
import { RegisterForm } from '@/components/features/auth/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar',
};

export default function Page() {
  return (
    <div className="p-6 md:p-10">
      {/* <AlertRegister /> */}
      <RegisterForm />
    </div>
  );
}
