import { useEffect } from "react";
import { SITE } from "@/constants/site";

type Props = {
  title?: string;
  description?: string;
};

export default function Seo({ title, description }: Props) {
  useEffect(() => {
    document.title = title ?? SITE.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) {
      meta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}