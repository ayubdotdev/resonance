import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Test } from "./test";
import { Suspense } from "react";

export default function TestPage() {
    prefetch(trpc.health.queryOptions())
    return (
        <HydrateClient>
            <Suspense fallback= {<div>Loading.....</div>}>

            <Test />
            </Suspense>
        </HydrateClient>

    )
}