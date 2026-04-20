import { useState } from "react";
import "./Studio.css";

function formatR(value) {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}

function formatPct(value) {
  return `${Math.round(value)}%`;
}

export default function OffshoreStudio() {
  const [inputs, setInputs] = useState({
    monthlyContribution: 10000,
    localSplit: 70,
    years: 5,
  });

  const update = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const offshSplit = 100 - inputs.localSplit;
  const months = inputs.years * 12;

  const localMonthly = inputs.monthlyContribution * (inputs.localSplit / 100);
  const offshMonthly = inputs.monthlyContribution * (offshSplit / 100);

  const localRate = 0.08 / 12;
  const offshRate = 0.1 / 12;
  const randDepreciation = 0.05;

  const localValue =
    localMonthly * ((Math.pow(1 + localRate, months) - 1) / localRate);

  const offshValueUSD =
    offshMonthly * ((Math.pow(1 + offshRate, months) - 1) / offshRate);
  const offshValueZAR =
    offshValueUSD * Math.pow(1 + randDepreciation, inputs.years);

  const totalA = localValue + offshValueZAR;

  const localOnlyValue =
    inputs.monthlyContribution *
    ((Math.pow(1 + localRate, months) - 1) / localRate);

  const offshOnlyLocal =
    inputs.monthlyContribution *
    ((Math.pow(1 + offshRate, months) - 1) / offshRate);
  const offshOnlyZAR =
    offshOnlyLocal * Math.pow(1 + randDepreciation, inputs.years);

  const splitWins = totalA > localOnlyValue;

  return (
    <div className="studio">
      <div className="studio__layout">
        <div className="studio__inputs">
          <p className="studio__inputs-label">Your numbers</p>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Monthly investment contribution</label>
            </div>
            <input
              type="number"
              className="studio__number-input"
              min={500}
              max={100000}
              step={500}
              value={inputs.monthlyContribution}
              onChange={(e) => update("monthlyContribution", e.target.value)}
            />
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Local allocation</label>
              <span>{formatPct(inputs.localSplit)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={inputs.localSplit}
              onChange={(e) => update("localSplit", e.target.value)}
            />
            <div className="studio__split-display">
              <span>{formatPct(inputs.localSplit)} JSE</span>
              <span>{formatPct(offshSplit)} offshore</span>
            </div>
          </div>

          <div className="studio__field">
            <div className="studio__field-header">
              <label>Time horizon</label>
              <span>{inputs.years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={inputs.years}
              onChange={(e) => update("years", e.target.value)}
            />
          </div>

          <div className="studio__sa-note">
            <p className="studio__sa-label">SA context applied</p>
            <ul className="studio__sa-list">
              <li>JSE All Share: 8% per year</li>
              <li>MSCI World Index: 10% per year</li>
              <li>Rand depreciation: 5% per year</li>
              <li>Tax-free savings account limit: R 36 000/year</li>
            </ul>
          </div>
        </div>

        <div className="studio__outputs">
          <p className="studio__inputs-label">Results</p>

          <div className="studio__compare">
            <div className="studio__compare-card">
              <p className="studio__compare-label">
                {formatPct(inputs.localSplit)} local / {formatPct(offshSplit)}{" "}
                offshore
              </p>
              <p className="studio__compare-value">{formatR(totalA)}</p>
              <p className="studio__compare-sub">
                Portfolio value after {inputs.years} years
              </p>
              <div className="studio__compare-rows">
                <div className="studio__compare-row">
                  <span>Local portfolio (JSE)</span>
                  <span>{formatR(localValue)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>Offshore portfolio (in ZAR)</span>
                  <span>{formatR(offshValueZAR)}</span>
                </div>
                <div className="studio__compare-row studio__compare-row--highlight">
                  <span>Combined total</span>
                  <span>{formatR(totalA)}</span>
                </div>
              </div>
            </div>

            <div className="studio__compare-card">
              <p className="studio__compare-label">100% local only</p>
              <p className="studio__compare-value">{formatR(localOnlyValue)}</p>
              <p className="studio__compare-sub">
                Portfolio value after {inputs.years} years
              </p>
              <div className="studio__compare-rows">
                <div className="studio__compare-row">
                  <span>Monthly invested</span>
                  <span>{formatR(inputs.monthlyContribution)}</span>
                </div>
                <div className="studio__compare-row">
                  <span>JSE return</span>
                  <span>8% per year</span>
                </div>
                <div className="studio__compare-row studio__compare-row--highlight">
                  <span>Final value</span>
                  <span>{formatR(localOnlyValue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`studio__verdict ${
              splitWins ? "studio__verdict--buy" : "studio__verdict--rent"
            }`}
          >
            <p className="studio__verdict-label">Studio verdict</p>
            <p className="studio__verdict-title">
              {splitWins
                ? `The ${formatPct(inputs.localSplit)}/${formatPct(
                    offshSplit
                  )} split outperforms going fully local.`
                : `Full local allocation outperforms this split over ${inputs.years} years.`}
            </p>
            <p className="studio__verdict-body">
              {splitWins
                ? `Your split portfolio reaches ${formatR(
                    totalA
                  )} versus ${formatR(
                    localOnlyValue
                  )} going fully local — a difference of ${formatR(
                    totalA - localOnlyValue
                  )}. The offshore portion benefits from both higher MSCI returns and rand depreciation working in your favour as a ZAR investor.`
                : `Over ${
                    inputs.years
                  } years, the JSE's 8% annual return on your full contribution reaches ${formatR(
                    localOnlyValue
                  )}. Your split reaches ${formatR(
                    totalA
                  )}. At shorter time horizons, rand depreciation and currency conversion costs can reduce the offshore advantage. Consider extending your horizon.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
