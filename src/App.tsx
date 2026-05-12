import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

type DayMetric = {
  date: string;
  metrics: {
    traffic: number;
    leads_created: number;
  };
};

type Dataset = {
  metadata: {
    start_date: string;
    end_date: string;
    days: number;
  };

  days: DayMetric[];
};

type MetricsData = {
  [key: string]: Dataset;
};

const executiveDatasets = {
  A: {
    traffic: 18320,
    leads: 231,
    winRate: 24,
    responseTime: 31,
    staleDeals: 92,
    resolution: 6.2,

    insights: [
      "Win rate dropped 18% this week",
      "Response time increased for 3 weeks",
      "Stale deals above healthy threshold",
    ],

    funnel: [
      ["Traffic", 100],
      ["Leads", 70],
      ["Qualified", 50],
      ["Deals", 35],
      ["Won", 20],
    ],
  },

  B: {
    traffic: 25200,
    leads: 510,
    winRate: 14,
    responseTime: 44,
    staleDeals: 130,
    resolution: 9.1,

    insights: [
      "Strong traffic but weak conversion",
      "Sales follow-up appears ineffective",
      "Large drop after qualification stage",
    ],

    funnel: [
      ["Traffic", 100],
      ["Leads", 82],
      ["Qualified", 40],
      ["Deals", 18],
      ["Won", 10],
    ],
  },

  C: {
    traffic: 12400,
    leads: 180,
    winRate: 32,
    responseTime: 18,
    staleDeals: 40,
    resolution: 12.5,

    insights: [
      "Support resolution time worsening",
      "Customer support under pressure",
      "Conversion remains healthy",
    ],

    funnel: [
      ["Traffic", 100],
      ["Leads", 62],
      ["Qualified", 55],
      ["Deals", 42],
      ["Won", 30],
    ],
  },

  D: {
    traffic: 9800,
    leads: 150,
    winRate: 11,
    responseTime: 52,
    staleDeals: 180,
    resolution: 14.3,

    insights: [
      "Pipeline heavily blocked",
      "Very high stale deal count",
      "Urgent sales intervention needed",
    ],

    funnel: [
      ["Traffic", 100],
      ["Leads", 50],
      ["Qualified", 30],
      ["Deals", 12],
      ["Won", 5],
    ],
  },
};

export default function App() {
  const [metricsData, setMetricsData] = useState<MetricsData>({});

  const [selectedDataset, setSelectedDataset] = useState<string>("A");

  const [daysToShow, setDaysToShow] = useState<number>(30);

  const [dashboardType, setDashboardType] = useState<
    "general" | "metrics" | "executive" | "decision"
  >("general");

  // LOAD JSON
  useEffect(() => {
    fetch("/metrics.json")
      .then((res) => res.json())
      .then((data) => {
        setMetricsData(data);
      })
      .catch((err) => {
        console.error("Error loading metrics.json", err);
      });
  }, []);

  // CURRENT DATASET
  const currentDataset = metricsData[selectedDataset];

  // CHART DATA
  const chartData =
    currentDataset?.days?.slice(-daysToShow).map((day) => ({
      date: day.date,
      traffic: day.metrics.traffic,
      leads: day.metrics.leads_created,
    })) || [];

  // EXECUTIVE DATA
  const executiveData =
    executiveDatasets[selectedDataset as keyof typeof executiveDatasets];

  // KPIs
  const totalTraffic = chartData.reduce((sum, item) => sum + item.traffic, 0);

  const totalLeads = chartData.reduce((sum, item) => sum + item.leads, 0);

  const conversionRate =
    totalTraffic > 0 ? ((totalLeads / totalTraffic) * 100).toFixed(2) : "0";

  const getStatusColor = (good: boolean, warning?: boolean) => {
    if (good) {
      return "bg-blue-50 border-blue-300 text-blue-700";
    }

    if (warning) {
      return "bg-yellow-50 border-yellow-300 text-yellow-700";
    }

    return "bg-red-50 border-red-300 text-red-700";
  };

  const decisionCards = [
    {
      question: "¿Estamos bien o mal hoy?",

      answer: Number(conversionRate) > 2 ? "Bien" : "Mal",

      origin: "Conversion Rate",

      className: getStatusColor(Number(conversionRate) > 2),
    },

    {
      question: "¿Las ventas están creciendo o cayendo?",

      answer: executiveData.winRate > 20 ? "Creciendo" : "Cayendo",

      origin: "Win Rate",

      className: getStatusColor(executiveData.winRate > 20),
    },

    {
      question: "¿Estamos trayendo suficiente tráfico?",

      answer: totalTraffic > 5000 ? "Sí" : "No",

      origin: "Traffic KPI",

      className: getStatusColor(totalTraffic > 5000),
    },

    {
      question: "¿Los vendedores están respondiendo lento?",

      answer: executiveData.responseTime > 35 ? "Sí" : "No",

      origin: "Response Time",

      className: getStatusColor(
        executiveData.responseTime < 35,
        executiveData.responseTime < 45,
      ),
    },

    {
      question: "¿Tenemos demasiados negocios estancados?",

      answer: executiveData.staleDeals > 100 ? "Sí" : "No",

      origin: "Stale Deals",

      className: getStatusColor(
        executiveData.staleDeals < 100,
        executiveData.staleDeals < 140,
      ),
    },

    {
      question: "¿Estamos convirtiendo bien los leads?",

      answer: Number(conversionRate) > 3 ? "Sí" : "No",

      origin: "Leads Conversion",

      className: getStatusColor(
        Number(conversionRate) > 3,
        Number(conversionRate) > 2,
      ),
    },

    {
      question: "¿Hay señales tempranas de caída?",

      answer: executiveData.winRate < 15 ? "Sí" : "No",

      origin: "Trend Analysis",

      className: getStatusColor(executiveData.winRate > 15),
    },

    {
      question: "¿La situación mejora o empeora?",

      answer:
        Number(conversionRate) > executiveData.winRate / 10
          ? "Mejora"
          : "Empeora",

      origin: "KPIs Comparison",

      className: getStatusColor(
        Number(conversionRate) > executiveData.winRate / 10,
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">
                {dashboardType === "general" && "General Dashboard"}

                {dashboardType === "metrics" && "Metrics Dashboard"}

                {dashboardType === "executive" && "Executive Sales Dashboard"}
              </h1>

              <p className="text-gray-500 mt-2">Dynamic analytics dashboard</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* DASHBOARD SWITCH */}
              <select
                className="border rounded-xl px-4 py-2"
                value={dashboardType}
                onChange={(e) =>
                  setDashboardType(
                    e.target.value as "general" | "metrics" | "executive",
                  )
                }
              >
                <option value="general">General Dashboard</option>

                <option value="metrics">Metrics Dashboard</option>

                <option value="executive">Executive Sales Dashboard</option>

                <option value="decision">Decision Questions</option>
              </select>

              {/* DATASET */}
              <select
                className="border rounded-xl px-4 py-2"
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
              >
                {Object.keys(metricsData).map((key) => (
                  <option key={key} value={key}>
                    Dataset {key}
                  </option>
                ))}
              </select>

              {/* DAYS */}
              <select
                className="border rounded-xl px-4 py-2"
                value={daysToShow}
                onChange={(e) => setDaysToShow(Number(e.target.value))}
              >
                <option value={30}>30 Days</option>

                <option value={90}>90 Days</option>

                <option value={180}>180 Days</option>

                <option value={365}>365 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* GENERAL DASHBOARD */}
        {dashboardType === "general" && (
          <>
            {/* KPI CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                ["Traffic", totalTraffic],
                ["Leads", totalLeads],
                ["Conversion", `${conversionRate}%`],
                ["Win Rate", `${executiveData.winRate}%`],
                ["Response", `${executiveData.responseTime}m`],
                ["Resolution", `${executiveData.resolution}h`],
              ].map(([title, value]) => (
                <div
                  key={String(title)}
                  className="bg-white rounded-2xl p-5 shadow-sm border"
                >
                  <h3 className="text-sm text-gray-500">{title}</h3>

                  <div className="mt-3 text-3xl font-bold">{value}</div>
                </div>
              ))}
            </section>

            {/* INSIGHTS */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Today's Focus</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {executiveData.insights.map((insight) => (
                  <div
                    key={insight}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <p className="text-red-700 font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FUNNEL */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">Sales Funnel</h2>

              <div className="space-y-4">
                {executiveData.funnel.map(([label, width]) => (
                  <div key={String(label)}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{label}</span>

                      <span>{width}%</span>
                    </div>

                    <div className="bg-gray-200 h-5 rounded-full">
                      <div
                        className="bg-blue-600 h-5 rounded-full"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* METRICS DASHBOARD */}
        {dashboardType === "metrics" && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-2xl font-bold mb-6">Traffic & Leads Trend</h2>

            <div
              style={{
                width: "100%",
                height: 500,
              }}
            >
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="traffic"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* EXECUTIVE DASHBOARD */}
        {dashboardType === "executive" && (
          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <div
              style={{
                width: "100%",
                height: 500,
              }}
            >
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar dataKey="traffic" fill="#2563eb" />

                  <Bar dataKey="leads" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* DECISION QUESTIONS DASHBOARD */}
        {dashboardType === "decision" && (
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Executive Decision Center</h2>

              <p className="text-gray-500 mt-2">
                Decisions generated dynamically from metrics.json
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {decisionCards.map((card) => (
                <div
                  key={card.question}
                  className={`
            rounded-2xl
            border
            p-6
            shadow-sm
            transition
            hover:scale-[1.02]
            ${card.className}
          `}
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm opacity-70">Executive Question</p>

                      <h3 className="text-xl font-bold mt-1">
                        {card.question}
                      </h3>
                    </div>

                    <div>
                      <p className="text-sm opacity-70">Current Status</p>

                      <div className="text-4xl font-bold mt-1">
                        {card.answer}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm opacity-70">Source</p>

                      <p className="font-medium mt-1">{card.origin}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
