"use client";

import { createContext, useContext } from "react";
import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";



type TTSVoiceItem =
    inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number]

interface TTSVoicesContextValue {
    customVoices: TTSVoiceItem[]
    systemVoices: TTSVoiceItem[]
    allVoices: TTSVoiceItem[];
}

const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null)


// this is a provider component that wraps your app and makes the context available to any child component that calls useTTSVoices().
export function TTSVoicesProvider({
    children,
    value
}: {
    children: React.ReactNode
    value: TTSVoicesContextValue
}) {
    return (
        <TTSVoicesContext.Provider value={value}>
            {children}
        </TTSVoicesContext.Provider>
    )
}

//This is a helper hook to read the context.
export function useTTSVoices() {
    const context = useContext(TTSVoicesContext)

    if (!context) {
        throw new Error("useTTSVoices must be used within a TTSVoicesProvider")
    }
    return context
}