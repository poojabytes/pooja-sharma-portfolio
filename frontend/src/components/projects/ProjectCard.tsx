import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { splitTechnologies } from "@/utils/format";
import type { Project } from "@/types/portfolio";

type Props = {
  project: Project;
  compact?: boolean;
};

export default function ProjectCard({ project, compact }: Props) {
  const tech = splitTechnologies(project.technologies);

  return (
    <article className="bento-card flex h-full flex-col">
      <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-background ring-1 ring-border">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            width={640}
            height={360}
          />
        ) : (
          <div className="flex h-full min-h-[140px] items-center justify-center text-sm text-muted">
            No preview
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          {project.is_featured ? (
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">
              Featured
            </span>
          ) : null}
        </div>
        {project.description && !compact ? (
          <p className="mt-2 line-clamp-3 text-sm text-muted">{project.description}</p>
        ) : null}
        {tech.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {tech.slice(0, compact ? 4 : 8).map((t) => (
              <li key={t} className="text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs transition hover:border-accent/40"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          ) : null}
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs transition hover:border-accent/40"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live demo
            </a>
          ) : null}
          {!compact ? (
            <Link
              to="/projects"
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs text-accent hover:underline"
            >
              All projects
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}