import './BackgroundGlow.css';

export default function BackgroundGlow() {
  return (
    <div className="bg-glow" aria-hidden="true">
      <div className="bg-glow__orb bg-glow__orb--1" />
      <div className="bg-glow__orb bg-glow__orb--2" />
      <div className="bg-glow__orb bg-glow__orb--3" />
    </div>
  );
}
