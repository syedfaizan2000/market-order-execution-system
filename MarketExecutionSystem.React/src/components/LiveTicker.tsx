import React from "react";

interface Props {
  tick: { symbol: string; price: number; time: string } | null;
}

export const LiveTicker: React.FC<Props> = ({ tick }) => {
  if (!tick) {
    return <div style={{ color: "#9ca3af", marginTop: "6px" }}>Waiting for live market feed...</div>;
  }

  return (
    <div style={{ marginTop: "6px", fontSize: "16px" }}>
      <b style={{ color: "#fff" }}>{tick.symbol}</b>{" → "}
      <span style={{ color: "#4ade80", fontWeight: "bold" }}>{tick.price.toFixed(2)}</span>
      <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "8px" }}>
        {new Date(tick.time).toLocaleTimeString()}
      </span>
    </div>
  );
};
