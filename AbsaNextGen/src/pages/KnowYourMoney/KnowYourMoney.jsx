import { useState } from "react";
import { studios } from "../../data/studios.Data";
import './KnowYourMoney.css';
import PropertyStudio from "./studios/PropertyStudio";
import CarStudio from "./studios/CarStudio";
import OffshoreStudio from "./studios/OffshoreStudio";

function StudioCard({ studio, onOpen }) {
  return (
    <div className="studio-card">
      <div className="studio-card__body">
        <h3 className="studio-card__name">{studio.name}</h3>
        <p className="studio-card__tagline">{studio.tagline}</p>
        <p className="studio-card__desc">{studio.description}</p>
        <p className="studio-card__context">{studio.context}</p>
      </div>
      <button className="studio-card__btn" onClick={() => onOpen(studio.id)}>
        Open studio
      </button>
    </div>
  );
}

function BackButton({ onBack }) {
  return (
    <button className="studio-back" onClick={onBack}>
      Back to Studios
    </button>
  );
}

export default function KnowYourMoney() {
  const [activeStudio, setActiveStudio] = useState(null);

  const renderStudio = () => {
    switch (activeStudio) {
      case "property-vs-renting":
        return <PropertyStudio />;
      case "car-vs-invest":
        return <CarStudio />;
      case "local-vs-offshore":
        return <OffshoreStudio />;
      default:
        return null;
    }
  };

  const activeData = studios.find((s) => s.id === activeStudio);

  if (activeStudio) {
    return (
      <div className="know-your-money">
        <BackButton onBack={() => setActiveStudio(null)} />
        <div className="know-your-money__studio-header">
          <h1 className="know-your-money__title">{activeData.name}</h1>
          <p className="know-your-money__context">{activeData.context}</p>
        </div>
        {renderStudio()}
      </div>
    );
  }

  return (
    <div className="know-your-money">
      <div className="know-your-money__header">
        <h1 className="know-your-money__title">Know Your Money Studio</h1>
        <p className="know-your-money__sub">
          Test major financial decisions before you make them. Each studio runs
          a real comparison using your numbers and South African context, then
          gives you a verdict.
        </p>
      </div>
      <section>
        <p className="know-your-money__section-label">Choose a studio</p>
        <div className="know-your-money__grid">
          {studios.map((studio) => (
            <StudioCard
              key={studio.id}
              studio={studio}
              onOpen={setActiveStudio}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
