/** Fixed, static page backdrop: a single soft wash of the secondary background. No animation cost. */
export default function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden>
      <div className="ambient-wash" />
    </div>
  );
}