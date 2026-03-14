"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

export  function Test() {
    
    const trpc = useTRPC()
    const { data } = useSuspenseQuery(trpc.health.queryOptions())
    return (
        <div>
            <p> {data.code} </p>
            <p> {data.status} </p>
        </div>
    )
}