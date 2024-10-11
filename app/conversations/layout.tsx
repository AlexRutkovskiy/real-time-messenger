import getConversations from "../actions/getConversations"
import SideBar from "../components/sidebar/Sidebar"
import ConversationsList from "./components/ConversationsList"

interface ConversationsLayoutProps {
  children: React.ReactNode
}

export default async function ConversationsLayout({
  children
}: ConversationsLayoutProps) {
  
  const conversations = await getConversations()

  return (
    <SideBar>
      <div className="h-full">
        <ConversationsList initialItems={conversations} />
        {children}
      </div>
    </SideBar>
  )
}