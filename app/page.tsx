import { LogoutButton } from '@/components/features/auth/logout-button';
import { requireAuth } from '@/lib/auth-utils';

const Page = async () => {
  await requireAuth();
  // const { data } = authClient.useSession();
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      {/* {JSON.stringify(data)}
      {data && 
      } */}
      <LogoutButton />
    </div>
  );
};

export default Page;
