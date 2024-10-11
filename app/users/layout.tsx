import getUsers from "../actions/getUsers"
import SideBar from "../components/sidebar/Sidebar"
import UserList from "./components/UserList"

interface UserLayoutProps {
  children: React.ReactNode
}

export default async function UserLayout({
  children
}: UserLayoutProps) {
  const users = await getUsers()
  
  return (
    <SideBar>
      <div className="h-full">
        <UserList items={users} />
        { children }
      </div>
    </SideBar>
  )
}