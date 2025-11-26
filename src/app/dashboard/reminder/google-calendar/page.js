"use client"

import GoogleCalendar from "@/components/Scheduler/google-calendar"
import { Suspense } from "react"


const CalendarTaskPage = () => {
    <Suspense fallback={<p>Loading Google Calendar...</p>}>
      <GoogleCalendar />
    </Suspense>
}

export default CalendarTaskPage



