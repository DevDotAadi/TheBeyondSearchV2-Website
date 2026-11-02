import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";

import { founderAvatars } from "@/config/founders";

const publicDirectory = join(process.cwd(), "public");

function hasAvatarImage(src: string) {
  if (!src.startsWith("/")) {
    return false;
  }

  return existsSync(join(publicDirectory, src.slice(1)));
}

export function SocialProofPill() {
  return (
    <div className="social-proof-pill inline-flex max-w-full items-center gap-3">
      <span className="isolate flex items-center">
        {founderAvatars.map((avatar, index) => {
          const imageAvailable = hasAvatarImage(avatar.src);

          return (
            <span
              key={avatar.src}
              className={`relative size-[28px] shrink-0 overflow-hidden rounded-full border-2 border-white/85 bg-white/60 backdrop-blur-[14px] backdrop-saturate-[140%] bg-[linear-gradient(145deg,#f4f5f7_0%,#e1e5e9_100%)] sm:size-[36px] ${
                index > 0 ? "-ml-2" : ""
              } ${index < 3 ? "" : "hidden sm:block"}`}
              style={{ zIndex: index + 1 }}
            >
              {imageAvailable ? (
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  width={64}
                  height={64}
                   className="size-full object-cover"
                   style={{ objectPosition: index === 1 ? "center 72%" : "center 25%" }}
                 />
              ) : (
                <span
                  role="img"
                  aria-label={`${avatar.alt} placeholder`}
                  className="grid size-full place-items-center"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-[17px] text-[#b7bdc6]"
                  >
                    <circle cx="12" cy="8.2" r="3.2" />
                    <path d="M4.8 20.5c.5-4 3.3-6.2 7.2-6.2s6.7 2.2 7.2 6.2H4.8Z" />
                  </svg>
                </span>
              )}
            </span>
          );
        })}
      </span>
      <span className="social-proof-text text-shimmer whitespace-nowrap text-[13px] font-medium leading-[1.25] tracking-[-0.01em] antialiased sm:text-[14px]">
        Built with founders & builders
      </span>
    </div>
  );
}
