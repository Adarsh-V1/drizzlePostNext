import { UserList } from "@/features/users/components/user-list";

function Page() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Lightseeker</h1>
      <UserList />
    </main>
  );
}

export default Page;
