import { UserList } from "@/features/users/components/user-list"

function page() {
  return (
    <div className="mx-10">
        <h1>Welcome to Lightseeker</h1>
        <UserList />
     </div>
  )
}

export default page