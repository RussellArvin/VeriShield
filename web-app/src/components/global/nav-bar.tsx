import { Search } from "~/components/dashboard/search"
import TeamSwitcher from "../dashboard/team-switcher";
import { UserButton } from "@clerk/nextjs";
import { VeriShieldLogo } from "./logo";

export function NavBar(){
    return  (
        <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <VeriShieldLogo size="small" /> 
          {/* <MainNav className="mx-6" /> */}
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserButton />
          </div>
        </div>
      </div>
    )
}