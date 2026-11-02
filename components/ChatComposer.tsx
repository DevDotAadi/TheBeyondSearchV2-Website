"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Tooltip } from "@/components/Tooltip";
import { useSpeechDictation } from "@/hooks/useSpeechDictation";

const MAX_TEXTAREA_HEIGHT = 160;
const FILE_ACCEPT = "image/*,application/pdf";
const ICON_CLASS = "size-4";

type Attachment = {
  id: string;
  name: string;
};

export function ChatComposer() {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentIdRef = useRef(0);
  const canSend = value.trim().length > 0;
  const {
    supported: speechSupported,
    listening,
    toggle: toggleDictation,
    cancel: cancelDictation,
  } = useSpeechDictation({ value, onChange: setValue });

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  function handleSubmit() {
    if (!canSend) return;

    // TODO: Replace this stub with the real campaign submission flow.
    console.log("ChatComposer submit:", {
      value,
      attachments: attachments.map((attachment) => attachment.name),
    });

    if (listening) cancelDictation();

    setValue("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;

    event.preventDefault();
    handleSubmit();
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      setAttachments((current) => [
        ...current,
        ...files.map((file) => {
          attachmentIdRef.current += 1;
          return {
            id: `${file.name}-${attachmentIdRef.current}`,
            name: file.name,
          };
        }),
      ]);
    }

    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id));
  }

  return (
    <div className="chat-composer w-full max-w-[720px] rounded-glass border border-white/60 bg-white/35 p-1.5 shadow-glass backdrop-blur-[16px]">
      <div className="chat-composer-inner min-h-[108px] rounded-composer border border-black/5 bg-[#FCFCFD] px-4 py-3.5 shadow-composer">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            aria-label="Campaign prompt"
            placeholder="What do you want to market today?"
            className="relative z-10 block max-h-[160px] min-h-[60px] w-full resize-none overflow-y-auto bg-transparent px-0 pb-1 pt-2 text-base leading-[1.45] text-ink caret-[#0b0b0f] outline-none sm:text-[17px]"
          />
        </div>

        {attachments.length > 0 ? (
          <ul aria-label="Attachments" className="flex flex-wrap gap-1.5 px-0 pb-1 pt-2">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="min-w-0 max-w-full">
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/5 bg-[#F1F2F4] py-1 pl-2.5 pr-1 text-xs font-medium text-[#4A4F57]">
                  <span className="min-w-0 truncate">{attachment.name}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${attachment.name}`}
                    onClick={() => removeAttachment(attachment.id)}
                    className="btn-skeu btn-neutral grid size-5 shrink-0 place-items-center rounded-full p-0"
                  >
                    <XIcon />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-3">
          <Tooltip label="Attach file">
            <button
              type="button"
              aria-label="Attach file"
              onClick={() => fileInputRef.current?.click()}
              className="btn-skeu btn-circle btn-neutral"
            >
              <PlusIcon />
            </button>
          </Tooltip>

          <div className="flex items-center gap-2">
            {speechSupported ? (
              <Tooltip label={listening ? "Stop listening" : "Speech to text"}>
                <button
                  type="button"
                  aria-label={listening ? "Stop dictation" : "Start dictation"}
                  aria-pressed={listening}
                  onClick={toggleDictation}
                  className={`btn-skeu btn-circle ${listening ? "btn-primary" : "btn-neutral"}`}
                >
                  <MicIcon />
                </button>
              </Tooltip>
            ) : null}

            <Tooltip label="Send">
              <button
                type="button"
                aria-label="Send"
                disabled={!canSend}
                onClick={handleSubmit}
                className="btn-skeu btn-circle btn-primary"
              >
                <ArrowUpIcon />
              </button>
            </Tooltip>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={FILE_ACCEPT}
          multiple
          className="hidden"
          onChange={handleFiles}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      className={ICON_CLASS}
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ICON_CLASS}
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ICON_CLASS}
      aria-hidden="true"
    >
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      className="size-3"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
