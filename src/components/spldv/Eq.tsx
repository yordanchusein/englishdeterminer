import { Fragment, type ReactNode } from "react";

const VAR_CLASS = ["vx", "vy"];

function colorize(text: string, vars: string[], keyBase: string): ReactNode[] {
  const re = new RegExp(`(?<![A-Za-z])(${vars.join("|")})(?![A-Za-z])`, "g");
  return text.split(re).map((part, i) => {
    const v = vars.indexOf(part);
    if (i % 2 === 1 && v !== -1)
      return (
        <span key={`${keyBase}-${i}`} className={VAR_CLASS[v] ?? "vx"}>
          {part}
        </span>
      );
    return <Fragment key={`${keyBase}-${i}`}>{part}</Fragment>;
  });
}

/**
 * Renders an equation string: variable letters are colour-coded,
 * {{…}} is highlighted gold and [[…]] gets a strike that steps animate in.
 */
export default function Eq({
  text,
  vars = ["x", "y"],
  className = "",
}: {
  text: string;
  vars?: string[];
  className?: string;
}) {
  const parts = text.split(/(\[\[.*?\]\]|\{\{.*?\}\})/g);
  return (
    <span className={`font-round font-bold tabular-nums ${className}`}>
      {parts.map((p, i) => {
        if (p.startsWith("[["))
          return (
            <span key={i} className="eq-cancel">
              {colorize(p.slice(2, -2), vars, `c${i}`)}
              <span className="eq-strike" />
            </span>
          );
        if (p.startsWith("{{"))
          return (
            <span key={i} className="eq-hl">
              {colorize(p.slice(2, -2), vars, `h${i}`)}
            </span>
          );
        return <Fragment key={i}>{colorize(p, vars, `t${i}`)}</Fragment>;
      })}
    </span>
  );
}
