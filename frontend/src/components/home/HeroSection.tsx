import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote, Sparkles } from "lucide-react";
import HashLink from "@/components/common/HashLink";
import Magnetic from "@/components/effects/Magnetic";
import HeroTechMesh from "@/components/effects/HeroTechMesh";
import SplitText from "@/components/effects/SplitText";
import { publicRole, SITE } from "@/constants/site";
import { useInteractiveMotion } from "@/hooks/useInteractiveMotion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import type { Education, Profile, Resume, SocialLink } from "@/types/portfolio";

type Props = {
  profile: Profile | null;
  socialLinks: SocialLink[];
  resume: Resume | null;
  education: Education[];
};

const FALLBACK_PORTRAIT = "/images/pooja-portrait.webp?v=pro-sharp-1";

export default function HeroSection({ profile }: Props) {
  const interactive = useInteractiveMotion();
  const { x: px, y: py } = useMouseParallax(interactive);
  const { scrollY } = useScroll();
  const scrollHint = useTransform(scrollY, [0, 140], [1, 0]);

  const photoX = useTransform(px, (v) => v * 4);
  const photoY = useTransform(py, (v) => v * 2.5);

  const fullName = profile?.name ?? SITE.name;
  const firstName = fullName.split(" ")[0];
  const subtitleRole = profile?.designation?.trim() || publicRole(profile?.designation);

  const portrait = (() => {
    const remote = profile?.profile_image_url;
    if (remote?.includes("pooja-portrait")) return remote;
    return FALLBACK_PORTRAIT;
  })();

  const quote = (
    <div className="max-w-[15rem] text-left">
      <Quote className="h-6 w-6 fill-accent/20 text-accent" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-muted">
        I build scalable backend systems, modern applications and meaningful digital experiences.
      </p>
    </div>
  );

  const quoteRight = (
    <div className="max-w-[15rem] text-right">
      <Quote className="h-6 w-6 fill-accent/20 text-accent lg:ml-auto" aria-hidden />
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Clean APIs, reliable databases and thoughtful interfaces, crafted to perform and built to last.
      </p>
    </div>
  );

  return (
    <section className="relative isolate overflow-x-clip pb-6">
      <HeroTechMesh />
      <div className="relative mx-auto max-w-7xl px-4 pt-8 text-center sm:pt-10 md:px-6 md:pt-12 lg:px-8 lg:pt-14">
        <header className="relative mx-auto flex max-w-3xl flex-col items-center gap-2 sm:gap-2.5">
          <Sparkles
            className="absolute -left-1 top-1 h-5 w-5 text-accent sm:-left-6 md:-left-10 lg:-left-14"
            aria-hidden
          />
          <h1 className="w-full font-display text-[2.15rem] font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-[3.35rem]">
            <SplitText
              text={`I'm ${firstName},`}
              highlight={[firstName]}
              whenInView={false}
              delay={0.1}
              className="block w-full text-center text-foreground"
            />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-base font-bold text-foreground sm:text-xl md:text-2xl"
          >
            {subtitleRole}
          </motion.p>
        </header>

        <div className="relative mx-auto mt-8 w-full max-w-6xl sm:mt-10 lg:mt-12">

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6 xl:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
              className="hidden items-start lg:flex lg:max-w-[17rem] xl:max-w-[18rem]"
            >
              {quote}
            </motion.div>

            <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:w-[27rem] lg:max-w-[27rem] xl:w-[29rem] xl:max-w-[29rem]">
              <div className="relative mx-auto h-[min(24rem,calc(100svh-15rem))] w-full sm:h-[min(29rem,calc(100svh-16rem))] lg:h-[min(31rem,calc(100svh-17.5rem))]">
                <motion.div
                  style={{ x: photoX, y: photoY }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full w-full">
                    {/* Semi-circle (dome) anchored to the bottom-center of the portrait wrapper */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative aspect-[2/1] w-[120%] shrink-0 sm:w-[132%]"
                      >
                        <div className="absolute -inset-x-2 -top-2 bottom-0 rounded-t-full border-2 border-b-0 border-[rgb(var(--c-peach)/0.8)]" />
                        <div className="absolute inset-0 rounded-t-full bg-[rgb(var(--c-peach))]" />
                      </motion.div>
                    </div>

                    <motion.img
                      src={portrait}
                      alt={`Portrait of ${fullName}`}
                      width={768}
                      height={951}
                      sizes="(min-width: 1024px) 29rem, (min-width: 640px) 23rem, 19rem"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 bottom-0 z-[1] mx-auto h-[96%] w-full max-w-full select-none object-contain object-bottom drop-shadow-[0_12px_28px_rgba(43,27,24,0.08)]"
                      draggable={false}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.78, duration: 0.5 }}
                  className="absolute inset-x-0 bottom-3 z-20 flex flex-col items-stretch justify-center gap-2.5 px-2 sm:bottom-5 sm:flex-row sm:gap-3"
                >
                  <Magnetic className="sm:w-auto">
                    <HashLink
                      id="resume"
                      className="btn-primary group w-full justify-center sm:min-w-[9.25rem] sm:w-auto"
                    >
                      Portfolio
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </HashLink>
                  </Magnetic>
                  <Magnetic className="sm:w-auto">
                    <HashLink
                      id="contact"
                      className="btn-ghost w-full justify-center !bg-white sm:min-w-[9.25rem] sm:w-auto"
                    >
                      Hire Me
                    </HashLink>
                  </Magnetic>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.58, duration: 0.55 }}
              className="hidden items-start justify-self-end text-right lg:flex lg:max-w-[17rem] xl:max-w-[18rem]"
            >
              {quoteRight}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-xl gap-8 px-4 pb-10 pt-8 text-left sm:grid-cols-2 sm:px-6 lg:hidden">
        {quote}
        <div className="text-left sm:text-right">
          <Quote className="h-6 w-6 fill-accent/20 text-accent sm:ml-auto" aria-hidden />
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Clean APIs, reliable databases and thoughtful interfaces, crafted to perform and built to last.
          </p>
        </div>
      </div>

      <motion.div style={{ opacity: scrollHint }} className="hidden justify-center pb-4 pt-2 lg:flex">
        <HashLink
          id="about"
          className="flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-label text-muted transition hover:text-foreground"
          aria-label="Scroll to about section"
        >
          Scroll
          <span className="flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
            <span className="h-1.5 w-1 animate-scroll-dot rounded-full bg-accent" />
          </span>
        </HashLink>
      </motion.div>
    </section>
  );
}