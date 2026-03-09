"use client"

import { useAppForm } from "@/hooks/use-app-form";
import { formOptions } from "@tanstack/react-form";
import { useForm } from "react-hook-form";
import z from "zod"

const ttsFormSchema = z.object({
    text: z.string().min(1, "Please enter some text"),
    voiceId: z.string().min(1, "Please select a voice"),

    //these are the parameters for the TTS model, you can adjust them as needed
    temperature: z.number(),
    topP: z.number(),
    topK: z.number(),
    repetitionPenalty: z.number(),
})

export type TTSFormValues = z.infer<typeof ttsFormSchema>

// Default values for the TTS form
export const defaultTTSValues: TTSFormValues = {
    text: "",
    voiceId: "",
    temperature: 0.8,
    topP: 0.95,
    topK: 1000,
    repetitionPenalty: 1.2,
};

export const ttsFormOptions = formOptions({
    defaultValues: defaultTTSValues
})

export function TextToSpeechForm({
    children,
    defaultValues
}: {
    children: React.ReactNode,
    defaultValues?: Partial<TTSFormValues>
}) {
    const form = useAppForm({
        ...ttsFormOptions,
        defaultValues: defaultValues ?? defaultTTSValues,
        validators: {
            onSubmit: ttsFormSchema
        },
        // logic add later
        onSubmit: async () => { }

    })
    return <form.AppForm>{children}</form.AppForm>;
}