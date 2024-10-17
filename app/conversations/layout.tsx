import getConversations from "../actions/getConversations"
import getUsers from "../actions/getUsers"
import SideBar from "../components/sidebar/Sidebar"
import ConversationsList from "./components/ConversationsList"

interface ConversationsLayoutProps {
  children: React.ReactNode
}

export default async function ConversationsLayout({
  children
}: ConversationsLayoutProps) {
  
  const conversations = await getConversations()
  const users = await getUsers();

  return (
    <SideBar>
      <div className="h-full">
        <ConversationsList 
          initialItems={conversations} 
          users={users}
        />
        {children}
      </div>
    </SideBar>
  )
}