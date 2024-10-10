import SideBar from "../components/sidebar/Sidebar"

interface UserLayoutProps {
  children: React.ReactNode
}

export default async function UserLayout({
  children
}: UserLayoutProps) {
  return (
    <SideBar>
      <div className="h-full">
        { children }
      </div>
    </SideBar>
  )
}