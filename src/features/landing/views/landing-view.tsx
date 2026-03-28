"use client"
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import {
    ArrowRight,
    AudioLines,
    Fingerprint,
    WandSparkles,
    Waves,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { GetStartedButton } from "@/features/landing/components/get-started-button";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { useEffect } from "react";

const editorialDisplay = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["600", "700"],
    variable: "--font-landing-display",
});

const editorialBody = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-landing-body",
});



const featureItems = [
    {
        title: "Cinematic synthesis",
        description:
            "Generate spoken output with emotional pacing, phrasing rhythm, and room-like presence.",
        icon: Waves,
    },
    {
        title: "Identity-preserving voice design",
        description:
            "Build a signature voice profile for your brand across videos, apps, and product moments.",
        icon: Fingerprint,
    },
    {
        title: "Prompt-directed style control",
        description:
            "Steer tone and texture with concise directives and instantly preview alternate takes.",
        icon: WandSparkles,
    },
    {
        title: "Production-speed rendering",
        description:
            "Go from script to final export quickly without sacrificing clarity or expressive depth.",
        icon: AudioLines,
    },
];

const workflow = [
    {
        step: "01",
        title: "Draft your script",
        body: "Start with raw notes or polished copy. Resonance adapts to both long-form and short-form content.",
    },
    {
        step: "02",
        title: "Shape the voice",
        body: "Tune tone, speed, and intensity. Preview multiple takes and keep the one that feels right.",
    },
    {
        step: "03",
        title: "Publish instantly",
        body: "Export in production-ready quality and plug it into your videos, ads, courses, and apps.",
    },
];

export default function LandingView() {
    useEffect(() => {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        window.scrollTo(0, 0);
    }, []);
    return (
        <div
            className={`landing-shell relative min-h-screen overflow-hidden text-gray-900 ${editorialBody.variable} ${editorialDisplay.variable}`}
        >
            <LandingNavbar />
            <div className="landing-orb landing-orb-top" />
            <div className="landing-orb landing-orb-mid" />
            <div className="landing-orb landing-orb-bottom" />

            <main className="relative z-10">
                <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-16 pt-36 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:pb-24 md:pt-42">
                    <div className="space-y-7">

                        <h1 className="landing-reveal font-(--font-landing-display) text-5xl leading-[1.02] tracking-tight text-gray-950 md:text-7xl [--delay:0.12s]">
                            Give every script
                            <span className="mt-1 pb-2 block bg-linear-to-r from-[#2563eb] via-[#0d9488] to-[#d97706] bg-clip-text text-transparent">
                                cinematic gravity.
                            </span>
                        </h1>
                        <p className="landing-reveal max-w-xl text-base leading-7 text-gray-600 md:text-lg [--delay:0.2s]">
                            Resonance transforms plain copy into expressive, premium-quality speech with nuanced timing, emotional texture, and controlled tone.
                        </p>
                        <div className="landing-reveal flex flex-wrap items-center gap-3 [--delay:0.28s]">
                            <GetStartedButton
                                size="lg"
                                className="group h-12 rounded-full bg-linear-to-r from-[#2b7fff] to-[#11a9a4] px-8 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(43,127,255,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
                            >
                                Get started
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:rotate-[360deg]" />
                            </GetStartedButton>
                            <a
                                href="#workflow"
                                className="inline-flex h-12 items-center rounded-full border border-gray-300 bg-white/80 px-7 text-sm font-semibold text-gray-800 transition-colors hover:bg-white"
                            >
                                View workflow
                            </a>
                        </div>

                    </div>

                    <div className="landing-reveal [--delay:0.22s]">
                        <div className="landing-panel relative overflow-hidden rounded-[28px] border border-gray-200/70 bg-white/72 p-7 shadow-[0_18px_52px_rgba(16,24,40,0.12)] backdrop-blur-xl">
                            <div className="absolute -right-14 -top-14 size-36 rounded-full bg-blue-100/90 blur-2xl" />
                            <div className="absolute -bottom-16 -left-8 size-40 rounded-full bg-amber-100/85 blur-2xl" />
                            <div className="relative space-y-5">
                                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/85 px-3 py-1 text-xs font-semibold text-blue-700">
                                    <WandSparkles className="size-3.5" />
                                    Signature voice preview
                                </div>
                                <div className="space-y-2">
                                    <p className="font-(--font-landing-display) text-3xl leading-tight text-gray-950">
                                        &ldquo;It sounds directed, emotional, and unmistakably ours.&rdquo;
                                    </p>
                                    <p className="text-sm leading-6 text-gray-600">
                                        Dial in confidence, warmth, or intensity and generate a refined narration take in seconds.
                                    </p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-gray-200/70 bg-white/85 p-4">
                                        <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Generation quality</p>
                                        <p className="pt-2 text-2xl font-semibold text-gray-900">Studio+</p>
                                    </div>
                                    <div className="rounded-2xl border border-gray-200/70 bg-white/85 p-4">
                                        <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Rendering speed</p>
                                        <p className="pt-2 text-2xl font-semibold text-gray-900">Near realtime</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="scroll-mt-36 mx-auto w-full max-w-6xl px-6 pb-16 md:scroll-mt-42 md:px-8 md:pb-24">
                    <div className="landing-reveal mb-8 flex items-end justify-between gap-4 [--delay:0.05s]">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Built for premium delivery</p>
                            <h2 className="font-(--font-landing-display) text-4xl text-gray-950 md:text-5xl">Everything needed for a premium voice stack.</h2>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {featureItems.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <Card
                                    key={feature.title}
                                    className="landing-reveal group border-gray-200/70 bg-white/78 py-0 shadow-[0_14px_40px_rgba(16,24,40,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/65 hover:shadow-[0_20px_44px_rgba(16,24,40,0.12)]"
                                    style={{ ["--delay" as string]: `${0.1 + index * 0.08}s` }}
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-blue-200/60 bg-blue-50/85 text-blue-700 transition-transform duration-300 group-hover:scale-105">
                                            <Icon className="size-5" />
                                        </div>
                                        <h3 className="text-xl font-semibold tracking-tight text-gray-900">{feature.title}</h3>
                                        <p className="pt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                <section id="workflow" className="scroll-mt-36 mx-auto w-full max-w-6xl px-6 pb-16 md:scroll-mt-42 md:px-8 md:pb-24">
                    <div className="landing-reveal rounded-[30px] border border-gray-200/70 bg-white/75 p-6 shadow-[0_18px_48px_rgba(16,24,40,0.1)] md:p-10 [--delay:0.05s]">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Workflow</p>
                            <h2 className="pt-2 font-(--font-landing-display) text-4xl text-gray-950 md:text-5xl">
                                From script to delivery in three elegant steps.
                            </h2>
                        </div>
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {workflow.map((item, index) => (
                                <div
                                    key={item.step}
                                    className="landing-reveal rounded-2xl border border-gray-200/70 bg-white/85 p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-teal-300/60"
                                    style={{ ["--delay" as string]: `${0.12 + index * 0.09}s` }}
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Step {item.step}</p>
                                    <h3 className="pt-3 text-lg font-semibold text-gray-900">{item.title}</h3>
                                    <p className="pt-2 text-sm leading-6 text-gray-600">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="cta" className="scroll-mt-36 mx-auto w-full max-w-6xl px-6 pb-20 md:scroll-mt-42 md:px-8 md:pb-28">
                    <div className="landing-reveal rounded-[32px] border border-blue-200/70 bg-linear-to-r from-[#eef6ff] via-[#f5fbff] to-[#f6fcfb] p-7 shadow-[0_20px_52px_rgba(16,24,40,0.12)] md:p-10 [--delay:0.1s]">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Start creating</p>
                                <h2 className="pt-2 font-(--font-landing-display) text-4xl leading-[1.05] text-gray-950 md:text-5xl">
                                    Build your first signature voice experience today.
                                </h2>

                            </div>
                            <GetStartedButton
                                size="lg"
                                className="group h-12 rounded-full bg-linear-to-r from-[#2b7fff] to-[#11a9a4] px-8 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(43,127,255,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
                            >
                                Get started
                                <ArrowRight className="size-4 transition-transform duration-300 group-hover:rotate-[360deg]" />
                            </GetStartedButton>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
