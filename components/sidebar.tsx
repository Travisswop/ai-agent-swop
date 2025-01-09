import { Home, Inbox, Users, HelpCircle, FileText, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="w-[250px] h-screen bg-background border-r p-4 flex flex-col">
      <Button variant="outline" className="w-full mb-4">
        <Plus className="mr-2 h-4 w-4" />
        New Thread
      </Button>
      
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Inbox className="mr-2 h-4 w-4" />
          Inbox
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Special Agents
        </Button>
      </nav>

      <div className="mt-auto space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Support
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          Docs
        </Button>
      </div>
    </div>
  )
}

