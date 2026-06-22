export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="Cargando">
      <div className="rl-stage">
        <span className="rl-ring" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="rl-logo" src="/assets/logo-mark.png" alt="" />
      </div>
    </div>
  );
}
