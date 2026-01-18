import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import chart from "../../../assets/chart.png";

const salesData = {
  Homes: [
    {
      year: 2025,
      sold: 48,
      low: "$255,000",
      high: "$10,500,000",
      avg: "$5,377,500",
      total: "$78,302,500",
    },
    {
      year: 2024,
      sold: 38,
      low: "$365,000",
      high: "$8,200,000",
      avg: "$2,012,829",
      total: "$76,487,500",
    },
    {
      year: 2023,
      sold: 43,
      low: "$185,000",
      high: "$6,202,625",
      avg: "$1,799,201",
      total: "$77,365,625",
    },
    {
      year: 2022,
      sold: 80,
      low: "$180,000",
      high: "$9,700,000",
      avg: "$1,561,468",
      total: "$124,917,425",
    },
    {
      year: 2021,
      sold: 116,
      low: "$310,800",
      high: "$8,000,000",
      avg: "$1,763,423",
      total: "$204,557,000",
    },
    {
      year: 2020,
      sold: 51,
      low: "$235,000",
      high: "$5,400,000",
      avg: "$1,216,419",
      total: "$62,037,354",
    },
    {
      year: 2019,
      sold: 45,
      low: "$250,000",
      high: "$9,000,000",
      avg: "$1,169,878",
      total: "$52,644,500",
    },
    {
      year: 2018,
      sold: 60,
      low: "$107,500",
      high: "$3,795,000",
      avg: "$1,049,483",
      total: "$62,969,000",
    },
    {
      year: 2017,
      sold: 38,
      low: "$225,000",
      high: "$3,600,000",
      avg: "$891,763",
      total: "$33,886,999",
    },
    {
      year: 2016,
      sold: 53,
      low: "$115,000",
      high: "$3,025,000",
      avg: "$1,041,606",
      total: "$55,205,109",
    },
    {
      year: 2015,
      sold: 38,
      low: "$189,000",
      high: "$4,000,000",
      avg: "$1,074,847",
      total: "$40,844,200",
    },
    {
      year: 2014,
      sold: 38,
      low: "$145,000",
      high: "$7,750,000",
      avg: "$1,080,381",
      total: "$41,054,462",
    },
    {
      year: 2013,
      sold: 48,
      low: "$165,000",
      high: "$3,500,000",
      avg: "$1,054,698",
      total: "$50,625,500",
    },
    {
      year: 2012,
      sold: 28,
      low: "$325,000",
      high: "$8,450,000",
      avg: "$1,183,607",
      total: "$33,141,000",
    },
    {
      year: 2011,
      sold: 27,
      low: "$135,000",
      high: "$12,000,000",
      avg: "$1,722,222",
      total: "$46,500,000",
    },
    {
      year: 2010,
      sold: 20,
      low: "$420,000",
      high: "$3,000,000",
      avg: "$1,285,075",
      total: "$25,701,500",
    },
    {
      year: 2009,
      sold: 22,
      low: "$240,000",
      high: "$6,500,000",
      avg: "$1,283,182",
      total: "$28,230,000",
    },
  ],
  Land: [
    {
      year: 2025,
      sold: 23,
      low: "$37,500",
      high: "$350,000",
      avg: "$193,750",
      total: "$3,441,500",
    },
    {
      year: 2024,
      sold: 26,
      low: "$40,000",
      high: "$1,500,000",
      avg: "$356,135",
      total: "$9,259,500",
    },
    {
      year: 2023,
      sold: 52,
      low: "$50,000",
      high: "$2,650,000",
      avg: "$361,185",
      total: "$18,781,639",
    },
    {
      year: 2022,
      sold: 70,
      low: "$45,500",
      high: "$4,490,000",
      avg: "$451,045",
      total: "$31,573,150",
    },
    {
      year: 2021,
      sold: 52,
      low: "$50,000",
      high: "$2,150,000",
      avg: "$440,308",
      total: "$22,896,000",
    },
    {
      year: 2020,
      sold: 30,
      low: "$32,500",
      high: "$1,550,000",
      avg: "$304,475",
      total: "$9,134,250",
    },
    {
      year: 2019,
      sold: 36,
      low: "$30,000",
      high: "$1,081,556",
      avg: "$248,815",
      total: "$8,957,356",
    },
    {
      year: 2018,
      sold: 32,
      low: "$35,000",
      high: "$2,475,000",
      avg: "$280,547",
      total: "$8,977,500",
    },
    {
      year: 2017,
      sold: 19,
      low: "$46,250",
      high: "$1,275,000",
      avg: "$203,053",
      total: "$3,858,000",
    },
    {
      year: 2016,
      sold: 38,
      low: "$45,000",
      high: "$3,000,000",
      avg: "$309,874",
      total: "$11,775,200",
    },
    {
      year: 2015,
      sold: 44,
      low: "$63,000",
      high: "$970,000",
      avg: "$208,680",
      total: "$9,181,900",
    },
    {
      year: 2014,
      sold: 31,
      low: "$63,500",
      high: "$1,650,000",
      avg: "$408,782",
      total: "$12,672,250",
    },
    {
      year: 2013,
      sold: 30,
      low: "$49,500",
      high: "$2,500,000",
      avg: "$397,550",
      total: "$11,926,500",
    },
    {
      year: 2012,
      sold: 33,
      low: "$55,000",
      high: "$13,950,000",
      avg: "$776,664",
      total: "$25,629,925",
    },
    {
      year: 2011,
      sold: 20,
      low: "$72,000",
      high: "$843,182",
      avg: "$287,865",
      total: "$5,757,300",
    },
    {
      year: 2010,
      sold: 16,
      low: "$75,000",
      high: "$875,000",
      avg: "$243,442",
      total: "$3,895,075",
    },
    {
      year: 2009,
      sold: 19,
      low: "$60,000",
      high: "$3,500,000",
      avg: "$380,553",
      total: "$7,230,499",
    },
  ],
  Condos: [
    {
      year: 2025,
      sold: 9,
      low: "$500,000",
      high: "$1,500,000",
      avg: "$1,000,000",
      total: "$8,405,000",
    },
    {
      year: 2024,
      sold: 6,
      low: "$450,000",
      high: "$1,500,000",
      avg: "$921,500",
      total: "$5,529,000",
    },
    {
      year: 2023,
      sold: 11,
      low: "$416,250",
      high: "$1,900,000",
      avg: "$1,059,477",
      total: "$11,654,250",
    },
    {
      year: 2022,
      sold: 9,
      low: "$405,000",
      high: "$1,600,000",
      avg: "$789,444",
      total: "$7,105,000",
    },
    {
      year: 2021,
      sold: 23,
      low: "$215,000",
      high: "$1,375,000",
      avg: "$729,174",
      total: "$16,771,000",
    },
    {
      year: 2020,
      sold: 11,
      low: "$220,000",
      high: "$990,000",
      avg: "$715,227",
      total: "$7,867,500",
    },
    {
      year: 2019,
      sold: 10,
      low: "$475,000",
      high: "$1,000,000",
      avg: "$760,750",
      total: "$7,607,500",
    },
    {
      year: 2018,
      sold: 5,
      low: "$425,000",
      high: "$950,000",
      avg: "$600,000",
      total: "$3,000,000",
    },
    {
      year: 2017,
      sold: 5,
      low: "$455,000",
      high: "$900,000",
      avg: "$690,500",
      total: "$3,452,500",
    },
    {
      year: 2016,
      sold: 10,
      low: "$287,000",
      high: "$855,000",
      avg: "$569,300",
      total: "$5,693,000",
    },
    {
      year: 2015,
      sold: 12,
      low: "$172,705",
      high: "$748,250",
      avg: "$363,054",
      total: "$4,356,650",
    },
    {
      year: 2014,
      sold: 9,
      low: "$380,000",
      high: "$1,050,000",
      avg: "$714,924",
      total: "$6,434,312",
    },
    {
      year: 2013,
      sold: 8,
      low: "$343,400",
      high: "$1,000,000",
      avg: "$613,738",
      total: "$4,909,900",
    },
    {
      year: 2012,
      sold: 9,
      low: "$290,000",
      high: "$850,000",
      avg: "$501,667",
      total: "$4,515,000",
    },
    {
      year: 2011,
      sold: 5,
      low: "$375,000",
      high: "$550,000",
      avg: "$430,000",
      total: "$2,150,000",
    },
    {
      year: 2010,
      sold: 7,
      low: "$200,000",
      high: "$932,300",
      avg: "$467,043",
      total: "$3,269,300",
    },
    {
      year: 2009,
      sold: 6,
      low: "$222,500",
      high: "$1,200,000",
      avg: "$605,583",
      total: "$3,633,500",
    },
  ],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 text-sm border border-blue-100">
        <p className="font-semibold text-blue-600">Year: {label}</p>
        <p className="text-gray-700">
          Total Sales:{" "}
          <span className="text-green-600">
            ${payload[0].value.toLocaleString()}
          </span>
        </p>
        <p className="text-gray-700">
          Avg Sale:{" "}
          <span className="text-blue-500">
            ${payload[1].value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesHistoryTab = ({ data }) => {
  const [activeTab, setActiveTab] = useState("Homes");
  const tabs = ["Homes", "Land", "Condos"];

  const chartData = salesData[activeTab].map((item) => ({
    year: item.year.toString(),
    sold: item.sold,
    total: Number(item.total.replace(/[$,]/g, "")),
    avg: Number(item.avg.replace(/[$,]/g, "")),
  }));

  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#2b4a9a] mb-6">
        St. John USVI Sales History
      </h2>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none ${
              activeTab === tab
                ? "bg-[#2b4a9a] text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        key={`chart-${activeTab}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-[300px] md:h-[450px] mb-10 px-6"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
            barGap={8}
            barCategoryGap={20}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2b4a9a" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#2b4a9a" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine
              y={1000000}
              stroke="red"
              strokeDasharray="3 3"
              label="Target"
            />

            <Bar
              dataKey="total"
              fill="url(#colorTotal)"
              name="Total Sales $"
              radius={[10, 10, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="avg"
              fill="url(#colorAvg)"
              name="Avg Sale $"
              radius={[10, 10, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Table */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto"
      >
        <table className="w-full text-sm md:text-base text-left border-collapse shadow rounded-xl overflow-hidden">
          <thead className="bg-[#2b4a9a] text-white">
            <tr>
              <th className="px-3 py-2">Year</th>
              <th className="px-3 py-2"># Sold</th>
              <th className="px-3 py-2">Lowest $</th>
              <th className="px-3 py-2">Highest $</th>
              <th className="px-3 py-2">Average $</th>
              <th className="px-3 py-2">Total $</th>
            </tr>
          </thead>
          <tbody>
            {salesData[activeTab].map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-3 py-2 font-semibold">{item.year}</td>
                <td className="px-3 py-2">{item.sold}</td>
                <td className="px-3 py-2">{item.low}</td>
                <td className="px-3 py-2">{item.high}</td>
                <td className="px-3 py-2">{item.avg}</td>
                <td className="px-3 py-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <div className="pt-16 ">
        <img src={chart} alt="chart" loading="lazy" />
      </div>
    </div>
  );
};

export default SalesHistoryTab;
