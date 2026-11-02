type SectionDividerProps = {
  className?: string;
};

export function SectionDivider({ className = "" }: SectionDividerProps) {
  return <div aria-hidden="true" className={`section-divider ${className}`} />;
}
