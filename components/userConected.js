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
          className="h-5 w-5"
        />

        <div className="mx-0.5">
          <div className={`truncate ${user?"w-18":"w-max pr-0.5"} md:font-normal md:text-xs`}>
            {!user ? "Login" : Capitalize(user.displayName)}
          </div>

          {/* <div className="">
          {!user ? "Login" : "Logout"}
        </div> */}
        </div>
        <div className={`${user ? "block mr-0.5" : "hidden"}`}>
          <ArrowIcon />
        </div>
      </div>
    </>
  )
}