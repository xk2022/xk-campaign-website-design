import { ArrowRight, Layers3, CalendarDays } from "lucide-react";
import { scenarioExamples } from "@/config/campaign";

/** Static examples deliberately use text, not form controls or live action links. */
export function ScenarioExamples() {
  return (
    <div className="scenario-examples" role="group" aria-label="其他情境的介面示意">
      {scenarioExamples.map((example) => {
        const Icon = example.id === "business" ? Layers3 : CalendarDays;
        return (
          <figure className="scenario-example" key={example.id}>
            <div className="scenario-example-heading">
              <p className="small-label">{example.label}</p>
              <h3>{example.title}</h3>
            </div>
            <div className="example-interface">
              <p className="example-brand">
                <Icon size={18} aria-hidden="true" />
                {example.brand}
              </p>
              <p className="example-title">{example.heading}</p>
              <ul className="example-options" aria-label="分類呈現示意">
                {example.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
              <div className="example-detail">
                <strong>{example.detailLabel}</strong>
                <p>{example.detail}</p>
              </div>
              <p className="example-action">
                <span>{example.action}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </p>
            </div>
            <figcaption>介面示意 · 虛構內容，非客戶網站或交付實績</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
