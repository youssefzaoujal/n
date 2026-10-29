import type { ReactNode } from "react";
import type { SiteRecord, ZeroElement } from "./types";

interface ZeroSectionProps {
  record: SiteRecord;
  /** Replace the markup of specific elements (by data-elem-id) with React nodes. */
  slots?: Record<string, ReactNode>;
}

function Element({ el, slot }: { el: ZeroElement; slot?: ReactNode }) {
  const props = { className: el.className, ...el.attrs };
  if (slot) {
    return (
      <div {...props}>
        <div className="tn-atom tn-atom__html">{slot}</div>
      </div>
    );
  }
  return <div {...props} dangerouslySetInnerHTML={{ __html: el.html }} />;
}

/**
 * Renders one Tilda Zero Block record. Positioning and typography come from the
 * per-record rules in sacredgarden.css (`#recXXXX .tn-elem[data-elem-id=…]`).
 */
export function ZeroSection({ record, slots }: ZeroSectionProps) {
  const recid = record.id.replace(/^rec/, "");
  const bg = record.attrs["data-bg-color"];
  return (
    <div
      id={record.id}
      className={record.className}
      data-record-type={record.type}
      data-section={record.name}
      {...record.attrs}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <div className="t396">
        <div className="t396__artboard rendered" data-artboard-recid={recid} {...record.artboard}>
          <div className="t396__carrier" data-artboard-recid={recid} />
          <div className="t396__filter" data-artboard-recid={recid} />
          {record.elements?.map((el) => (
            <Element key={el.id} el={el} slot={slots?.[el.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}
