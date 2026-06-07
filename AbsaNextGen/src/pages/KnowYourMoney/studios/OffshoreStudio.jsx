import { useState } from "react";
import "./Studio.css";
import StudioExplainer from "./StudioExplainer";

function formatR(value) {
  return `R ${Math.round(value).toLocaleString("en-ZA")}`;
}

function safeNum(value, fallback = 0) {
  const n = Number(value);
  return isNaN(n) || !isFinite(n) ? fallback : n;
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

  const explainerSections = [
    {
      heading: "What this studio calculates",
      body: "This studio projects the growth of your investment portfolio under different local and offshore allocation splits. It compares a chosen split against a fully local allocation, accounting for the different return rates of the JSE All Share Index and the MSCI World Index, plus the effect of rand depreciation on offshore returns when converted back to ZAR.",
    },
    {
      heading: "Key assumptions",
      items: [
        "JSE All Share Index: 8% per year — the long-run historical average in nominal ZAR terms.",
        "MSCI World Index: 10% per year — the long-run historical average in USD terms.",
        "Rand depreciation: 5% per year — the long-run average depreciation of ZAR against USD.",
        "Offshore returns are converted back to ZAR using the depreciation assumption, which inflates returns for ZAR investors.",
        "No tax implications are modelled — in reality, offshore gains may be subject to capital gains tax.",
      ],
    },
    {
      heading: "Why rand depreciation helps offshore investors",
      body: "When the rand weakens against the dollar, your offshore investment is worth more in rand terms even if its USD value has not changed. South African investors have historically benefited from this effect — a 10% USD return plus 5% rand depreciation produces approximately 15% in ZAR terms. This is a genuine structural advantage of offshore diversification for SA investors.",
    },
    {
      heading: "The TFSA opportunity",
      body: "South African investors can invest up to R36 000 per year into a Tax-Free Savings Account, with a lifetime limit of R500 000. Growth, dividends, and withdrawals are completely tax-free. This is the most tax-efficient investment vehicle available to South Africans and should be maximised before moving to taxable offshore accounts.",
    },
    {
      heading: "What this studio does not account for",
      body: "This is a simplified projection. It does not include platform fees (typically 0.5–1% per year), fund-level TERs, withholding taxes on foreign dividends, or the practical costs of currency conversion. In practice, these reduce returns by approximately 1–2% per year. The projections should be treated as directional rather than precise.",
    },
    {
      heading: "Regulation 28 and retirement funds",
      body: "South African retirement funds — including RAs and pension funds — are governed by Regulation 28, which limits offshore exposure to 45% of the fund. This means your RA cannot go fully offshore even if you wanted it to. General investment accounts and TFSAs have no such restriction.",
    },
  ];

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
      <StudioExplainer
        title="Local vs. Offshore"
        sections={explainerSections}
      />
    </div>
  );
}
