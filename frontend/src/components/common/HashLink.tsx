import type { MouseEvent } from "react";
import { Link, useLocation, type LinkProps } from "react-router-dom";

type Props = Omit<LinkProps, "to"> & { id: string };

/** Link to a homepage section. Smooth-scrolls in place when already on "/". */
export default function HashLink({ id, onClick, children, ...rest }: Props) {
  const { pathname } = useLocation();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || pathname !== "/") return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <Link {...rest} to={{ pathname: "/", hash: `#${id}` }} onClick={handle}>
      {children}
    </Link>
  );
}