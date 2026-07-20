import type { ComponentChildren, JSX } from "preact";

export interface ListRowProps {
  className?: string;
  title?: string;
  chips?: readonly string[];
  tabIndex?: number;
  onActivate?(): void;
  children: ComponentChildren;
}

/**
 * Shared "filled card" list row wrapper (`.list-row`) plus its optional chip
 * row. Views compose their own head markup as children — the row-head shape
 * varies enough (market's two-strong price layout vs. rewards/analysis'
 * title+meta+values) that forcing one head layout isn't worth it.
 */
export function ListRow({ className, title, chips, tabIndex, onActivate, children }: ListRowProps) {
  const onKeyDown = onActivate
    ? (event: JSX.TargetedKeyboardEvent<HTMLElement>): void => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      }
    : undefined;

  return (
    <article
      class={className ? `list-row ${className}` : "list-row"}
      title={title}
      tabIndex={tabIndex}
      onDblClick={onActivate}
      onKeyDown={onKeyDown}
    >
      {children}
      {chips && chips.length > 0 && (
        <div class="chips">
          {chips.map((chip, index) => <span class="chip" key={index}>{chip}</span>)}
        </div>
      )}
    </article>
  );
}

export interface RowHeadProps {
  title: string;
  meta: string;
  values?: readonly string[];
  titleTag?: "h2" | "h3";
}

/** Common title/meta/values head used by rewards' and analysis' list rows. */
export function RowHead({ title, meta, values, titleTag: Tag = "h2" }: RowHeadProps) {
  return (
    <div class="row-head">
      <div>
        <Tag class="row-title">{title}</Tag>
        <div class="row-meta">{meta}</div>
      </div>
      {values && values.length > 0 && (
        <div class="row-values">
          {values.map((value, index) => <span key={index}>{value}</span>)}
        </div>
      )}
    </div>
  );
}
