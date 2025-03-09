import { Search } from "~/components/dashboard/search"
// import TeamSwitcher from "../dashboard/team-switcher";
import { UserButton } from "@clerk/nextjs";
import { VeriShieldLogo } from "./logo";
import { ModeToggle } from "~/components/ui/mode-toggle";

export function NavBar(){
    return  (
        <div className="border-b bg-gray-800 dark:bg-gray-950 text-white">
        <div className="flex h-16 items-center px-4">
          <VeriShieldLogo size="small" /> 
          {/* <MainNav className="mx-6" /> */}
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ModeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    )
}