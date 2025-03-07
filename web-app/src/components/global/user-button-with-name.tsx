"use client"
import { UserButton, useUser } from "@clerk/nextjs"

export function UserButtonWithName() {
  const { user, isLoaded } = useUser()
  
  return (
    <div className="flex items-center gap-3">
        <UserButton />
      {isLoaded && user && (
        <span className="text-sm font-medium text-gray-200">
          {user.firstName} {user.lastName}
        </span>
      )}
    </div>
  )
}