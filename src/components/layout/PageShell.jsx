import BackgroundGlow from './BackgroundGlow';

export default function PageShell({ children }) {
  return (
    <div className="page-shell">
      <BackgroundGlow />
      {children}
    </div>
  );
}
