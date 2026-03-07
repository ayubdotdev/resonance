import { prisma } from "@/lib/db";


export default async function TestPage() {
    const voices = await prisma.voice.findMany()

    return (
        <div>
            <h1> Voices {voices.length} </h1>
            <ul>
                {
                    voices.map((voice) => (
                        <li key={voice.id}>{voice.name}-{voice.variant}</li>
                    )
                    )}
            </ul>
        </div>
    )
}