export function SectionHead({ label, title, id, children }: { label: string; title: string; id: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="t-label">{label}</span>
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      {children ? <div className="t-body-l max-w-[640px] text-muted">{children}</div> : null}
    </div>
  );
}
