"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Sidebar from "./Sidebar";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
];

interface ChartDataItem {
  name: string;
  value: number;
}

export default function ChartDashboard() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("trainingData");
    const trainer = localStorage.getItem("trainerData");
    if (stored && trainer) {
      const training = JSON.parse(stored);
      const trainerData = JSON.parse(trainer);
      const combined: Record<string, number> = {};
      Object.entries(training).forEach(([tech, list]: any) => {
        combined[tech] = (combined[tech] || 0) + list.length;
      });
      Object.entries(trainerData).forEach(([tech, list]: any) => {
        combined[tech] = (combined[tech] || 0) + list.length;
      });
      const chartArray = Object.entries(combined).map(([name, value]) => ({
        name,
        value,
      }));
      setChartData(chartArray);
    }
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4">Technology Distribution</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
