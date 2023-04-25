import { AuthContextProvider } from "../context"
import { Capitalize } from "../utils/Capitalize"
import { ArrowIcon } from "./icons"

export const UserConected = () => {
  const { user } = AuthContextProvider()
  return (
    <>
      {/*  <UserForm /> */}
      <div className="flex items-center justify-content-center justify-center">

        <img
          src="/account-circle.png"
        />
        <div className="ml-1">
          <div className="truncate w-20">
            {!user ? "Login" : Capitalize(user.displayName)}
          </div>

          {/* <div className="">
          {!user ? "Login" : "Logout"}
        </div> */}
        </div>
        <div className={`${user ? "block" : "hidden"}`}>
          <ArrowIcon />
        </div>
      </div>
    </>
  )
}