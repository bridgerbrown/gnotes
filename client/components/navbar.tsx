import React from "react"
import Link from "next/link"
import { startOfToday, format } from "date-fns"
import { useUser } from "@auth0/nextjs-auth0/client"

export default function Navbar(){
    let today = startOfToday()
    let todayFormatted = format(today, 'M-d-y')
    const { user } = useUser()
    
    return(
        <nav className="py-6 px-8 text-slate-900 flex justify-between">
            <div className="flex justify-center items-center">
                <h1 className="text-white text-xl border-4 border-[#ebc157] font-extrabold rounded-full px-2.5 py-0.5 mr-2 ">L</h1>
                <h1 className="text-white text-2xl uppercase font-semibold tracking-wide">
                    League
                    <span className="text-moduleHeader/60">Notes</span>
                </h1>
            </div>
            <ul className="text-moduleHeader/50 tracking-wide font-base pt-1 flex space-x-8 text-base">
                <li>
                    Home
                </li>
                <li>
                    {
                        user !== undefined && (
                        <Link href={`/user/note/${user.email}_${todayFormatted}`}>Today</Link>
                        )
                    }
                </li>
                <li>
                    <Link href={`/calendar`}>Calendar</Link>
                </li>
                <li>
                <Link href={`/user/login`}>Log In</Link>
                </li>
            </ul>
        </nav>
    )
}