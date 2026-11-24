import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";
import type { Project } from "@/types/portfolio";
import { splitTechnologies } from "@/utils/format";

type Props = {
  project: Project;
  className?: string;
};

const pill =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:border-accent/70 hover:bg-accent/30";

export default function ProjectCard({ project, className = "" }: Props) {
  const tech = splitTechnologies(project.technologies);
  const primaryUrl = project.live_url ?? project.github_url;
  const tall = project.is_featured ? "min-h-[28rem] md:min-h-[34rem]" : "min-h-[24rem] md:min-h-[26rem]";

  return (
    <TiltCard
      reveal={false}
      max={4}
      cursor="project"
      className={`overflow-hidden rounded-[2rem] border border-border bg-surface ${tall} ${className}`}
    >
      {/* Image with reveal + hover zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.18, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-display text-[10rem] font-extrabold text-accent/20 transition-transform duration-[900ms] group-hover:scale-110"
            style={{ background: "rgb(var(--c-peach))" }}
            aria-hidden
          >
            {project.title.charAt(0)}
          </div>
        )}
      </motion.div>

      {/* Legibility scrim + hover lighting */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[rgb(43_27_24/0.88)] via-[rgb(43_27_24/0.4)] to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[rgb(43_27_24/0.18)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {project.is_featured ? (
        <span className="absolute left-5 top-5 z-10 rounded-full border border-accent/50 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-label text-white backdrop-blur">
          Featured
        </span>
      ) : null}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white md:p-8">
        {tech.length > 0 ? (
          <ul className="mb-4 flex flex-wrap gap-1.5">
            {tech.slice(0, project.is_featured ? 8 : 5).map((t) => (
              <li
                key={t}
                className="rounded-md border border-white/15 bg-black/30 px-2 py-0.5 text-[11px] text-white/85 backdrop-blur"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-end justify-between gap-4">
          <h3
            className={`font-display font-extrabold leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-1 ${
              project.is_featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
            }`}
          >
            <span className="hover-underline pb-1">{project.title}</span>
          </h3>

          {primaryUrl ? (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
            >
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-12" />
            </a>
          ) : null}
        </div>

        <div className="project-extra">
          {project.description ? (
            <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-relaxed text-white/80">
              {project.description}
            </p>
          ) : null}
          {project.github_url || project.live_url ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.github_url ? (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={pill}>
                  <Github className="h-3.5 w-3.5" aria-hidden /> GitHub
                </a>
              ) : null}
              {project.live_url ? (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={pill}>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Live demo
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </TiltCard>
  );
}