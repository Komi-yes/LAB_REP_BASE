import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:8080/api/stocks";

function formatChange(change, changePct) {
  const num = parseFloat(change);
  const isPositive = num >= 0;
  return { isPositive, change, changePct };
}

function StatCard({ label, value, highlight }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      borderRadius: "12px",
      padding: "16px 20px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      border: highlight ? "1px solid rgba(99,179,237,0.3)" : "1px solid rgba(255,255,255,0.07)"
    }}>
      <span style={{ fontSize: "11px", color: "#8899aa", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      <span style={{ fontSize: "18px", fontWeight: 600, color: highlight || "#e2e8f0" }}>{value}</span>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json["Global Quote"]);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message || "Connection error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchStock, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchStock]);

  const q = data;
  const changeInfo = q ? formatChange(q["09. change"], q["10. change percent"]) : null;
  const changeColor = changeInfo?.isPositive ? "#68d391" : "#fc8181";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1923 0%, #162032 50%, #0f1923 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      padding: "24px"
    }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "13px", color: "#4a90d9", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
            Stock Gateway
          </div>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 700, color: "#e2e8f0" }}>
            Market Quotes
          </h1>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "28px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}>
          {/* Symbol + Price */}
          {q && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#e2e8f0" }}>{q["01. symbol"]}</div>
                <div style={{ fontSize: "13px", color: "#8899aa", marginTop: "2px" }}>
                  Latest trading day: {q["07. latest trading day"]}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "34px", fontWeight: 800, color: "#e2e8f0" }}>
                  ${parseFloat(q["05. price"]).toFixed(2)}
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: changeColor,
                  background: changeInfo?.isPositive ? "rgba(104,211,145,0.12)" : "rgba(252,129,129,0.12)",
                  padding: "2px 10px",
                  borderRadius: "20px",
                  display: "inline-block",
                  marginTop: "4px"
                }}>
                  {changeInfo?.isPositive ? "▲" : "▼"} {q["09. change"]} ({q["10. change percent"]})
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          {q && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              <StatCard label="Open" value={`$${parseFloat(q["02. open"]).toFixed(2)}`} />
              <StatCard label="Prev. Close" value={`$${parseFloat(q["08. previous close"]).toFixed(2)}`} />
              <StatCard label="High" value={`$${parseFloat(q["03. high"]).toFixed(2)}`} highlight="#68d391" />
              <StatCard label="Low" value={`$${parseFloat(q["04. low"]).toFixed(2)}`} highlight="#fc8181" />
              <StatCard label="Volume" value={parseInt(q["06. volume"]).toLocaleString()} />
              <StatCard label="Change" value={`${q["09. change"]} (${q["10. change percent"]})`} highlight={changeColor} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(252,129,129,0.1)",
              border: "1px solid rgba(252,129,129,0.3)",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "#fc8181",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "center"
            }}>
              ⚠ {error}
            </div>
          )}

          {/* No data */}
          {!q && !loading && !error && (
            <div style={{ textAlign: "center", color: "#8899aa", padding: "20px 0", marginBottom: "20px" }}>
              No data available
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={fetchStock}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: loading ? "rgba(74,144,217,0.3)" : "linear-gradient(135deg, #4a90d9, #3a7bc8)",
                color: "#fff",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "⟳  Loading..." : "⟳  Refresh"}
            </button>

            <button
              onClick={() => setAutoRefresh(a => !a)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: `1px solid ${autoRefresh ? "#68d391" : "rgba(255,255,255,0.15)"}`,
                background: autoRefresh ? "rgba(104,211,145,0.1)" : "transparent",
                color: autoRefresh ? "#68d391" : "#8899aa",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {autoRefresh ? "● Auto 30s" : "○ Auto"}
            </button>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#556677" }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#334455" }}>
          Powered by Spring Gateway · Alpha Vantage API
        </div>
      </div>
    </div>
  );
}