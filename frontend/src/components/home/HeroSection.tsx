import { motion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { SITE } from "@/constants/site";
import type { Profile } from "@/types/portfolio";

type Props = {
  profile: Profile | null;
};

export default function HeroSection({ profile }: Props) {
  const name = profile?.name ?? SITE.name;
  const headline = profile?.designation ?? SITE.headline;

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-12 md:grid-cols-12 md:px-6 md:pt-20">
      <motion.div
        className="bento-card md:col-span-7 md:flex md:flex-col md:justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-3 text-sm font-medium text-accent">Hello, I&apos;m</p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {name}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">{headline}</p>
        {profile?.location ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-accent" aria-hidden />
            {profile.location}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            View projects
          </Link>
          <a
            href="#contact"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:border-accent/50"
          >
            Get in touch
          </a>
        </div>
      </motion.div>

      <motion.div
        className="bento-card relative overflow-hidden md:col-span-5"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent" />
        <div className="relative flex min-h-[280px] items-center justify-center p-6">
          {profile?.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={`${name} profile`}
              className="h-56 w-56 rounded-2xl object-cover ring-1 ring-border"
              loading="eager"
              width={224}
              height={224}
            />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-background text-5xl font-semibold text-accent ring-1 ring-border">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
        </div>
        <a
          href="#about"
          className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-xs text-muted transition hover:text-accent"
        >
          Scroll <ArrowDown className="h-3 w-3" />
        </a>
      </motion.div>
    </section>
  );
}