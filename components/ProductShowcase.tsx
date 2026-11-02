"use client";



import Image from "next/image";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Tooltip } from "@/components/Tooltip";



const PROMPT = "Launch ads for my burger and pasta restaurant";

const PROMPT_WORDS = PROMPT.split(" ");



const AGENT_STEPS = [

  "Reading your website",

  "Finding diners near you",

  "Drafting 6 ads for Meta and Google",

  "Ready for your review",

];



const ANALYTICS = [

  { label: "Projected reach", value: 48200 },

  { label: "Est. clicks", value: 1420 },

  { label: "Est. cost per click", value: 0.41 },

];



const BURGER_BITE = { src: "/showcase/burger-bite.webp", w: 700, h: 875 };

const PASTA_FORKS = { src: "/showcase/pasta-forks.webp", w: 400, h: 711 };

const BURGER_CAP = { src: "/showcase/burger-cap.webp", w: 400, h: 711 };



function BotMark({ size = 14 }: { size?: number }) {

  return (

    <img

      src="/icons/brands/beyond-search-icon.webp"

      alt="Beyond Search"

      style={{ width: size, height: size }}

      className="rounded-full"

    />

  );
}



function PlusIconSmall() {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="h-4 w-4">

      <path d="M12 5v14M5 12h14" />

    </svg>

  );

}



function ArrowUpIconSmall() {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">

      <path d="m5 12 7-7 7 7" />

      <path d="M12 19V5" />

    </svg>

  );

}



function CheckIcon() {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">

      <path d="M20 6 9 17l-5-5" />

    </svg>

  );

}



function SpinnerIcon() {

  return (

    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#dbeafe] border-t-[#3f8cff]" aria-hidden="true" />

  );

}



function MenuIcons() {

  return (

    <>

      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="menu-icon">

        <path d="M5 14h14M12 10v8" />

        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />

      </svg>

      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="menu-icon">

        <circle cx="12" cy="12" r="9" />

        <path d="M15 9a3 3 0 1 1-6 0" />

      </svg>

      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="menu-icon">

        <circle cx="11" cy="11" r="8" />

        <path d="m21 21-4.3-4.3" />

      </svg>

      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="menu-icon">

        <line x1="2" y1="7" x2="22" y2="7" />

        <line x1="2" y1="12" x2="22" y2="12" />

        <line x1="6" y1="12" x2="8" y2="12" />

        <line x1="10" y1="12" x2="12" y2="12" />

      </svg>

    </>

  );

}



function TrashIcon({ className }: { className?: string }) {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#5b6070" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className ?? "h-5 w-5"}>

      <path d="M3 6h18" />

      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />

      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />

      <line x1="10" x2="10" y1="11" y2="17" />

      <line x1="14" x2="14" y1="11" y2="17" />

    </svg>

  );

}



function ShieldCheckIcon() {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">

      <path d="M20 13c0 5-5.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C9.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />

      <path d="m9 12 2 2 4-4" />

    </svg>

  );

}



function GaugeIcon() {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">

      <path d="m12 14 4-4" />

      <path d="M3.34 19a10 10 0 1 1 17.32 0" />

    </svg>

  );

}



function MegaphoneIcon() {

  return (

    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">

      <path d="m3 11 18-5v12L3 14v-3z" />

      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />

    </svg>

  );

}



export function ProductShowcase() {

  const sectionRef = useRef<HTMLElement | null>(null);

  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);

  const timersRef = useRef<number[]>([]);

  const reduceMotionRef = useRef(false);

  const isMountedRef = useRef(false);



  const [dockBounce, setDockBounce] = useState(false);

  const [windowOpen, setWindowOpen] = useState(false);

  const [windowFading, setWindowFading] = useState(false);

  const [promptWordCount, setPromptWordCount] = useState(0);

  const [sendPressed, setSendPressed] = useState(false);

  const [chatCompact, setChatCompact] = useState(false);

  const [reviewOpen, setReviewOpen] = useState(false);

  const [agentStepCount, setAgentStepCount] = useState(0);

  const [agentStepReadyCount, setAgentStepReadyCount] = useState(0);

  const [feedVisible, setFeedVisible] = useState(false);

  const [story1Visible, setStory1Visible] = useState(false);

  const [story2Visible, setStory2Visible] = useState(false);

  const [googleVisible, setGoogleVisible] = useState(false);

  const [draftsLabelVisible, setDraftsLabelVisible] = useState(false);

  const [summaryVisible, setSummaryVisible] = useState(false);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);

  const [chipsVisible, setChipsVisible] = useState(false);

  const [budgetVisible, setBudgetVisible] = useState(false);

  const [tilesVisible, setTilesVisible] = useState(false);

  const [analyticsValues, setAnalyticsValues] = useState<number[]>(() => ANALYTICS.map(() => 0));

  const [approveHover, setApproveHover] = useState(false);

  const [approvePressed, setApprovePressed] = useState(false);

  const [statusLive, setStatusLive] = useState(false);

  const [bannerVisible, setBannerVisible] = useState(false);



  const clear = useCallback(() => {

    timersRef.current.forEach((id) => window.clearTimeout(id));

    timersRef.current = [];

  }, []);



  const reset = useCallback(() => {

    setDockBounce(false);

    setWindowOpen(false);

    setWindowFading(false);

    setPromptWordCount(0);

    setSendPressed(false);

    setChatCompact(false);

    setReviewOpen(false);

    setAgentStepCount(0);

    setAgentStepReadyCount(0);

    setFeedVisible(false);

    setStory1Visible(false);

    setStory2Visible(false);

    setGoogleVisible(false);

    setDraftsLabelVisible(false);

    setSummaryVisible(false);

    setChipsVisible(false);

    setBudgetVisible(false);

    setTilesVisible(false);

    setAnalyticsValues(ANALYTICS.map(() => 0));

    setApproveHover(false);

    setApprovePressed(false);

    setStatusLive(false);

    setBannerVisible(false);

  }, []);



  const startTimeline = useCallback(() => {

    clear();

    reset();



    const schedule = (fn: () => void, ms: number) => {

      if (!isMountedRef.current) return;

      const id = window.setTimeout(fn, ms);

      timersRef.current.push(id);

    };



    schedule(() => setDockBounce(true), 300);

    schedule(() => setDockBounce(false), 650);

    schedule(() => setDockBounce(true), 1000);

    schedule(() => setDockBounce(false), 1350);



    schedule(() => setWindowOpen(true), 1000);



    schedule(() => setPromptWordCount(1), 1600);

    for (let i = 1; i < PROMPT_WORDS.length; i += 1) {

      schedule(() => setPromptWordCount(i + 1), 1600 + 140 * i);

    }



    schedule(() => setSendPressed(true), 3500);

    schedule(() => setSendPressed(false), 3650);



    schedule(() => {

      setSendPressed(false);

      setChatCompact(true);

    }, 3600);



    schedule(() => setReviewOpen(true), 4000);



    AGENT_STEPS.forEach((_, index) => {

      schedule(() => setAgentStepCount(index + 1), 4400 + index * 700);

      schedule(() => setAgentStepReadyCount(index + 1), 4900 + index * 700);

    });



    schedule(() => setFeedVisible(true), 5600);

    schedule(() => setStory1Visible(true), 5800);

    schedule(() => setStory2Visible(true), 6000);

    schedule(() => setGoogleVisible(true), 6300);

    schedule(() => setDraftsLabelVisible(true), 6300);



    schedule(() => setSummaryVisible(true), 7600);

    schedule(() => setAnalyticsVisible(true), 7720);

    schedule(() => setChipsVisible(true), 7840);



    schedule(() => setTilesVisible(true), 8200);



    schedule(() => setApproveHover(true), 10200);

    schedule(() => {

      setApproveHover(false);

      setApprovePressed(true);

    }, 10800);



    schedule(() => {

      setApprovePressed(false);

      setStatusLive(true);

      setBannerVisible(true);

    }, 11000);

    schedule(() => setBannerVisible(false), 13400);



    schedule(() => setWindowFading(true), 15200);

    schedule(() => reset(), 15800);

    schedule(() => startTimeline(), 16400);

  }, [clear, reset, AGENT_STEPS.length, PROMPT_WORDS.length]);



  useEffect(() => {

    isMountedRef.current = true;

    return () => {

      isMountedRef.current = false;

    };

  }, []);



  const windowClassNames = ["window", windowOpen ? "is-open" : "", windowFading ? "is-fading" : ""]

    .filter(Boolean)

    .join(" ");



  useEffect(() => {

    let cancelled = false;

    if (typeof window !== "undefined") {

      [BURGER_BITE, PASTA_FORKS, BURGER_CAP].forEach((spec) => {

        const img = new (window as any).Image();

        img.src = spec.src;

        img.decode().then(() => {}).catch(() => {});

      });

    }

    return () => { cancelled = true; };

  }, []);



  useLayoutEffect(() => {

    const node = wrapRef.current;

    if (!node) return;

    const update = () => {

      setScale(Math.min(1, node.clientWidth / 1120));

    };

    update();

    const ro = new ResizeObserver(update);

    ro.observe(node);

    return () => ro.disconnect();

  }, []);



  useEffect(() => {

    const node = sectionRef.current;

    if (!node) return;



    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    reduceMotionRef.current = reduceMotion;



    if (reduceMotion) {

      setWindowOpen(true);

      setChatCompact(true);

      setPromptWordCount(PROMPT_WORDS.length);

      setAgentStepCount(AGENT_STEPS.length);

      setAgentStepReadyCount(AGENT_STEPS.length);

      setFeedVisible(true);

      setStory1Visible(true);

      setStory2Visible(true);

      setGoogleVisible(true);

      setDraftsLabelVisible(true);

      setSummaryVisible(true);

      setTilesVisible(true);

      setAnalyticsValues(ANALYTICS.map((item) => item.value));

      setStatusLive(true);

      return;

    }



    const observer = new IntersectionObserver(

      (entries) => {

        const entry = entries[0];

        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {

          startTimeline();

        }

      },

      { threshold: [0.35] }

    );



    observer.observe(node);



    return () => {

      observer.disconnect();

      clear();

    };

  }, [startTimeline, clear]);



  useEffect(() => {

    if (!tilesVisible) {

      setAnalyticsValues(ANALYTICS.map(() => 0));

      return;

    }



    if (reduceMotionRef.current) {

      setAnalyticsValues(ANALYTICS.map((item) => item.value));

      return;

    }



    let frame = 0;

    const startedAt = performance.now();

    const tick = (now: number) => {

      const progress = Math.min((now - startedAt) / 1200, 1);

      setAnalyticsValues(ANALYTICS.map((item) => item.value * progress));

      if (progress < 1) {

        frame = window.requestAnimationFrame(tick);

      }

    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);

  }, [tilesVisible]);



  return (

    <section id="product" aria-labelledby="product-heading" ref={sectionRef} className="product-section">

      <div className="site-container">

        <div className="section-header">

          <p className="section-eyebrow">The product</p>

          <h2 id="product-heading" className="section-heading">

            From one sentence to live ads

          </h2>

        </div>

      </div>



      <div className="product-device-wrap" ref={wrapRef}>

        <p className="sr-only">

          Product demo: a user describes their restaurant, agents draft Meta and Google ads using the restaurant's photos, the user approves and launches.

        </p>

        <div className="scene-wrap" aria-hidden="true">

          <div className="desktop" style={{ "--s": scale } as React.CSSProperties}>

            <div className="menu-bar">

              <div className="menu-left">

                <BotMark size={14} />

                <span className="menu-title">Beyond Search</span>

                <span className="menu-item">File</span>

                <span className="menu-item">Edit</span>

                <span className="menu-item">View</span>

                <span className="menu-item">Window</span>

                <span className="menu-item">Help</span>

              </div>

              <div className="menu-right">

                <MenuIcons />

                <span>Tue 9:41 AM</span>

              </div>

            </div>



            <div className="dock">

              <div className={`dock-item ${dockBounce ? "dock-bounce" : ""}`}>

                <Tooltip label="Beyond Search">

                  <BotMark size={40} />

                </Tooltip>

                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-white" />

              </div>

              <div className="dock-item">

                <Tooltip label="Claude">

                  <img src="/icons/brands/claude.svg" alt="Claude" className="h-[34px] w-[34px] rounded-[9px]" />

                </Tooltip>

              </div>

              <div className="dock-item">

                <Tooltip label="ChatGPT">

                  <img src="/dock/chatgpt.svg" alt="ChatGPT" className="h-[34px] w-[34px] rounded-[9px]" />

                </Tooltip>

              </div>

              <div className="dock-item">

                <Tooltip label="Chrome">

                  <img src="/images/marketing/desktop/dock/chrome.svg" alt="Chrome" className="h-[34px] w-[34px] rounded-[9px]" />

                </Tooltip>

              </div>

              <div className="dock-divider" aria-hidden="true" />

              <div className="dock-item">

                <Tooltip label="Trash">

                  <img src="/images/marketing/desktop/dock/trash.png" alt="Trash" className="h-[34px] w-[34px]" />

                </Tooltip>

              </div>

            </div>



            <div className={`${windowClassNames}`}>

              <div className="window-glass" />

              <div className="window-content">

                <div className="window-titlebar">

                  <div className="traffic-lights">

                    <span className="traffic-light red" />

                    <span className="traffic-light yellow" />

                    <span className="traffic-light green" />

                  </div>

                  <BotMark size={18} />

                  <span>New campaign</span>

                  <span

                    className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"

                    style={{ backgroundColor: statusLive ? "#ecfdf3" : "#f1f2f4", color: statusLive ? "#16a34a" : "#5b6070" }}

                  >

                    <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: statusLive ? "#16a34a" : "#5b6070" }} />

                    {statusLive ? "Live" : "Draft"}

                  </span>

                </div>

                <div className="window-body">

                  <section className="chat-pane">

                    <div className="chat-scroll">

                      {!chatCompact ? (

                        <div className="centered-composer">

                          <div className="composer-card">

                            <p className="min-h-[19px] text-[13px] leading-[1.45] text-[#3f444c]">

                              {PROMPT_WORDS.slice(0, promptWordCount).map((word, index) => (

                                <span key={`${word}-${index}`}>

                                  {index > 0 ? " " : ""}

                                  {word}

                                </span>

                              ))}

                            </p>

                            <div className="composer-inner">

                              <span className="btn-skeu btn-neutral grid h-[28px] w-[28px] place-items-center rounded-full p-0">

                                <PlusIconSmall />

                              </span>

                              <span

                                className="btn-skeu btn-primary grid h-[28px] w-[28px] place-items-center rounded-full p-0"

                                style={sendPressed ? { background: "linear-gradient(180deg, #4f9bff 0%, #3481f5 100%)", boxShadow: "0 1px 4px rgba(63,140,255,0.22), inset 0 1px 0 rgba(255,255,255,0.35)" } : undefined}

                              >

                                <ArrowUpIconSmall />

                              </span>

                            </div>

                          </div>

                        </div>

                      ) : (

                        <div className="flex flex-col gap-3">

                          <div className="rounded-[14px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2">

                            <p className="text-[13px] leading-[1.45] text-[#3f444c]">{PROMPT}</p>

                          </div>

                          <ul className="flex flex-col gap-3">

                            {AGENT_STEPS.map((step, index) => (

                              <li

                                key={step}

                                className={`flex items-center gap-3 text-[13px] text-[#3f444c] transition-[opacity,transform] duration-300 ease-out ${index < agentStepCount ? "is-in" : "opacity-0 translate-y-6"}`}

                              >

                                <span className="flex h-4 w-4 shrink-0 items-center justify-center">

                                  {index < agentStepReadyCount ? <CheckIcon /> : <SpinnerIcon />}

                                </span>

                                {step}

                              </li>

                            ))}

                          </ul>

                          {summaryVisible ? (

                            <div className="rounded-[14px] border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 text-[13px] leading-[1.5] text-[#3f444c]">

                              Done. I drafted 6 ads for Meta and Google, aimed at diners within 5 miles. Review them on the right, then approve to launch.

                            </div>

                          ) : null}

                          <div className="mt-2">

                            <p className="text-[11px] text-[#8b8f99]">Targeting</p>

                            <div className={`flex flex-wrap gap-2 mt-1 ${chipsVisible ? "is-in" : "opacity-0"}`}>

                              {["Local diners", "Ages 22 to 45", "Within 5 miles", "Burger and pasta lovers"].map((chip, i) => (

                                <span

                                  key={chip}

                                  className="inline-flex h-[22px] items-center rounded-full border border-[rgba(0,0,0,0.07)] bg-gradient-to-b from-[#fafafa] to-[#f1f1f1] px-2 text-[11px] font-medium text-[#1a1a1a] shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.09)]"

                                >

                                  {chip}

                                </span>

                              ))}

                            </div>

                          </div>

                          <div className={`mt-2 ${budgetVisible ? "is-in" : "opacity-0"}`}>

                            <p className="text-[11px] text-[#8b8f99]">Budget split</p>

                            <div className="relative h-[6px] w-full rounded-[3px] bg-[#e5e7eb] overflow-hidden mt-1">

                              <div className="h-full bg-[#4a90f8] w-[60%]" />

                              <div className="absolute right-0 h-full bg-[#a9c8fb] w-[40%]" />

                            </div>

                            <p className="mt-1 text-[11px] text-[#5b6070]">Meta 60% · Google 40%</p>

                          </div>

                          <div className="follow-up-composer mx-3 mb-3">

                            <span className="text-[13px] text-[#9aa0ab]">Ask for changes...</span>

                            <span className="grid h-[24px] w-[24px] place-items-center rounded-full bg-gradient-to-b from-[#5aa6ff] to-[#3f8cff] opacity-50">

                              <span className="h-3 w-3"><ArrowUpIconSmall /></span>

                            </span>

                          </div>

                        </div>

                      )}

                    </div>

                  </section>



                  <aside className={`review-panel ${reviewOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-24 pointer-events-none"}`}>

                    <div className="review-row1">

                      <div className="review-tabs">

                        <span className="review-tab is-active">Drafts</span>

                        <span className="review-tab">Analytics</span>

                      </div>

                      <span className={`review-drafts-label ${draftsLabelVisible ? "opacity-100" : "opacity-0"}`}>6 ads drafted</span>

                    </div>

                    <div className="review-scroll-area">

                      <div className="review-cards">

                        {feedVisible ? (

                          <article className="feed-card transition-[opacity,transform] duration-[400ms] ease-out">

                            <div className="feed-photo relative">

                              <Image

                                src={BURGER_BITE.src}

                                alt="Burger bite"

                                width={BURGER_BITE.w}

                                height={BURGER_BITE.h}

                                className="w-full h-full object-cover"

                                placeholder="empty"

                              />

                              <span className="feed-tag">Feed</span>

                            </div>

                            <div className="feed-head">

                              <div className="feed-avatar">F&F</div>

                              <div className="feed-info">

                                <p className="feed-brand">Fork & Flame</p>

                                <p className="feed-sponsored">Sponsored</p>

                              </div>

                            </div>

                            <p className="feed-headline">Smash burgers, made to order</p>

                            <span className="feed-chip">Order now</span>

                          </article>

                        ) : (

                          <div className="skeleton w-[188px] h-[311px]" />

                        )}

                        {story1Visible ? (

                          <article className="story-card transition-[opacity,transform] duration-[400ms] ease-out relative">

                            <Image

                              src={PASTA_FORKS.src}

                              alt="Pasta forks"

                              width={PASTA_FORKS.w}

                              height={PASTA_FORKS.h}

                              className="story-img w-full h-full object-cover"

                              placeholder="empty"

                            />

                            <div className="story-overlay-top">

                              <div className="story-brand">

                                <div className="story-avatar" />

                                <p className="story-brand-name">Fork & Flame</p>

                              </div>

                              <span className="story-tag">Story</span>

                            </div>

                            <div className="story-overlay-bottom">

                              <p className="story-headline">Fresh pasta, made daily</p>

                              <span className="story-cta">Book a table</span>

                            </div>

                          </article>

                        ) : (

                          <div className="skeleton w-[179px] h-[318px]" />

                        )}

                        {story2Visible ? (

                          <article className="story-card transition-[opacity,transform] duration-[400ms] ease-out relative">

                            <Image

                              src={BURGER_CAP.src}

                              alt="Burger cap"

                              width={BURGER_CAP.w}

                              height={BURGER_CAP.h}

                              className="story-img w-full h-full object-cover"

                              placeholder="empty"

                            />

                            <div className="story-overlay-top">

                              <div className="story-brand">

                                <div className="story-avatar" />

                                <p className="story-brand-name">Fork & Flame</p>

                              </div>

                              <span className="story-tag">Story</span>

                            </div>

                            <div className="story-overlay-bottom">

                              <p className="story-headline">Open late. Hungry yet?</p>

                              <span className="story-cta">Order now</span>

                            </div>

                          </article>

                        ) : (

                          <div className="skeleton w-[179px] h-[318px]" />

                        )}

                        {googleVisible ? (

                          <article className="google-card transition-[opacity,transform] duration-[400ms] ease-out">

                            <Image

                              src="/showcase/forkandflame-favicon.webp"

                              alt="Fork & Flame favicon"

                              width={28}

                              height={28}

                              className="google-favicon w-[28px] h-[28px] rounded-full object-cover"

                              placeholder="empty"

                            />

                            <div className="google-text">

                              <p className="google-subtext">Sponsored · forkandflame.com</p>

                              <p className="google-headline">Fork & Flame | Smash Burgers & Fresh Pasta</p>

                              <p className="google-desc">Wood-fired kitchen, open late. Order online or book a table tonight.</p>

                            </div>

                          </article>

                        ) : (

                          <div className="skeleton h-[72px] flex-1" />

                        )}

                        <div className={`analytics ${tilesVisible ? "is-in" : "opacity-0 translate-y-6"}`} style={{ transition: "opacity 300ms ease, transform 300ms ease" }}>

                          {ANALYTICS.map((item, index) => (

                            <div key={item.label} className="analytics-tile">

                              <p className="analytics-label">{item.label}</p>

                              <p className="analytics-value">{analyticsValues[index] ?? 0}</p>

                            </div>

                          ))}

                        </div>

                      </div>

                      <div className="review-control">

                        <div className="budget-row">

                          <span className="budget-label">Daily budget</span>

                          <span className="budget-value">$40</span>

                        </div>

                        <div className="switch-row">

                          <div className="switch">

                            <div className="switch-knob" />

                          </div>

                          <span className="switch-label">Require approval</span>

                        </div>

                        <div className="shrink-0">

                          <span

                            className="btn-skeu btn-primary relative h-[36px] overflow-hidden rounded-[12px] px-3 text-[12px] font-medium"

                            style={approvePressed ? { background: "linear-gradient(180deg, #4f9bff 0%, #3481f5 100%)" } : undefined}

                          >

                            <span

                              className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-white/40 via-white/10 to-white/30 transition-transform duration-[340ms]"

                              style={{ transform: approveHover || approvePressed ? "translateY(0)" : "translateY(100%)" }}

                            />

                            <span className="relative z-10">Approve & launch</span>

                          </span>

                        </div>

                      </div>
                      </div>

                    </aside>

                  </div>

                </div>



                <div className={`notification-banner ${bannerVisible ? "is-visible" : ""}`} style={{ pointerEvents: "none" }}>

                  <BotMark size={28} />

                  <div className="banner-text">

                    <p className="banner-title">Beyond Search</p>

                    <p className="banner-body">Your campaign is live on Meta and Google.</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="menu-card flex h-[72px] min-w-[184px] flex-none items-center gap-[14px] rounded-[16px] px-0 py-0 pl-[14px] pr-[16px] no-underline" style={{ marginTop: 36 }}>
          <span className="menu-card-tile grid size-[44px] shrink-0 place-items-center rounded-[12px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="menu-card-icon size-5">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="menu-card-label block truncate text-[14px] font-medium leading-[1.25]">Ad Drafting</span>
            <span className="menu-card-description mt-0.5 block truncate text-[12px] font-normal leading-[1.3]">Campaigns written for you</span>
          </span>
        </div>

        <p className="product-caption">Illustrative demo with sample data</p>



        <div className="product-points">

          {[

            { title: "You approve everything", description: "Nothing goes live until you say so." },

            { title: "Budget guardrails", description: "Set daily caps. The agent stays inside them." },

            { title: "Meta and Google", description: "Draft and launch on both from one place." },

          ].map((item, index) => {

            const Icon = index === 0 ? ShieldCheckIcon : index === 1 ? GaugeIcon : MegaphoneIcon;

            return (

              <div key={item.title} className="product-point">

                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] border border-[rgba(0,0,0,0.07)] bg-gradient-to-b from-[#fafafa] to-[#f1f1f1] shadow-[0_1px_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.09)]">

                  <Icon />

                </div>

                <div>

                  <p className="text-[16px] font-semibold text-[#14161a]">{item.title}</p>

                  <p className="product-point-desc mt-1 text-[14px] leading-[1.5] text-[#5b6070]">{item.description}</p>

                </div>

              </div>

            );

          })}

        </div>

    </section>

  );

}