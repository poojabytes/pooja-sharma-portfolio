/** Subtle tech-inspired mesh behind the hero — light, slow, non-distracting. */
export default function HeroTechMesh() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(56rem,125vh)] overflow-hidden"
      aria-hidden
    >
      <div className="absolute -left-[12%] top-[6%] h-[22rem] w-[22rem] rounded-full bg-[rgb(var(--c-peach)/0.55)] blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      <div className="absolute -right-[8%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-[rgb(var(--c-accent-2)/0.45)] blur-3xl sm:h-[26rem] sm:w-[26rem]" />
      <div className="absolute bottom-[8%] left-[38%] h-48 w-48 rounded-full bg-[rgb(var(--c-peach)/0.35)] blur-3xl" />
      <div className="hero-mesh-grid absolute inset-0 opacity-[0.18]" />
      <svg
        className="hero-mesh-lines absolute inset-0 h-full w-full text-accent/[0.14]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          className="hero-mesh-path"
          d="M0 320 C 200 280, 400 360, 600 300 S 1000 240, 1200 280"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          className="hero-mesh-path"
          style={{ animationDelay: "-8s" }}
          d="M0 420 C 260 380, 520 460, 780 400 S 1050 340, 1200 390"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle className="hero-mesh-node" cx="180" cy="300" r="3" fill="currentColor" />
        <circle className="hero-mesh-node" cx="420" cy="340" r="2.5" fill="currentColor" />
        <circle className="hero-mesh-node" cx="720" cy="280" r="3" fill="currentColor" />
        <circle className="hero-mesh-node" cx="980" cy="360" r="2.5" fill="currentColor" />
      </svg>
    </div>
  );
}