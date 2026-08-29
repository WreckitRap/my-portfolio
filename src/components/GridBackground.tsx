import './GridBackground.css';

function GridBackground() {
  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-bg-plane" />
      <div className="grid-bg-horizon" />
    </div>
  );
}

export default GridBackground;