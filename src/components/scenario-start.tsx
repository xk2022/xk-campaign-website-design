"use client";

import { ArrowUpRight } from "lucide-react";
import type { ScenarioId } from "@/config/campaign";

export function ScenarioStart({ scenarioId }: { scenarioId: ScenarioId }) {
  return (
    <a
      className="scenario-start"
      href="#brief"
      onClick={(event) => {
        // Finish the hash navigation before the form takes keyboard focus.
        event.preventDefault();
        window.history.replaceState(null, "", "#brief");
        document.getElementById("brief")?.scrollIntoView({ block: "start" });
        window.dispatchEvent(
          new CustomEvent<ScenarioId>("xk:scenario", { detail: scenarioId }),
        );
      }}
    >
      用這個情境開始 <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
