import Image from "next/image";
import { ChatComposer } from "@/components/ChatComposer";
import { SocialProofPill } from "@/components/SocialProofPill";
import { AppShowcase } from "@/components/AppShowcase";

export default function Home() {
  return (
    <>
      <main className="hero-shell relative isolate flex min-h-svh flex-col items-center justify-center gap-[var(--spacing-hero)] px-4 pb-[6vh]">
        <Image
          src="/hero-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-bottom"
        />
        <div className="hero-bottom-fade" aria-hidden="true" />
        <div className="relative z-10 flex w-full flex-col items-center gap-[var(--spacing-hero)]">
          <div className="flex w-full flex-col items-center gap-5">
            <SocialProofPill />
            <h1 className="max-w-full text-balance text-center text-headline text-ink [word-spacing:0.06em] md:whitespace-nowrap">
              Put your marketing on autopilot
            </h1>
          </div>
          <ChatComposer />
        </div>
      </main>
      <AppShowcase />
    </>
  );
}
