import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(3500000);
  const [downPayment, setDownPayment] = useState(700000);
  const [interestRate, setInterestRate] = useState(7);
  const [termYears, setTermYears] = useState(30);
  const [propertyTax, setPropertyTax] = useState(2800);
  const [hoa, setHoa] = useState(800);

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  const principalAndInterest =
    (loanAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  const totalPayment = principalAndInterest + propertyTax + hoa;

  const chartData = {
    labels: ["Principal & Interest", "Property Taxes", "HOA Dues"],
    datasets: [
      {
        data: [principalAndInterest, propertyTax, hoa],
        backgroundColor: ["#1F5C60", "#5FA6A8", "#BFD4D5"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: { legend: { display: false } },
  };

  const reset = () => {
    setHomePrice(3500000);
    setDownPayment(700000);
    setInterestRate(7);
    setTermYears(30);
    setPropertyTax(2800);
    setHoa(800);
  };

  return (
    <div className="bg-gradient-to-br from-[#77a5a5] to-[#4e7e7e] min-h-screen p-6 flex justify-center items-center font-[Poppins]">
      <div className="bg-transparent flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Left Side */}
        <div className="flex-1 text-white">
          <h1 className="text-4xl font-serif mb-4">MORTGAGE CALCULATOR</h1>
          <p className="mb-8 text-sm md:text-base max-w-lg opacity-90">
            Estimate your monthly mortgage payment, including the principal and
            interest, property taxes, and HOA. Adjust the values to generate a
            more accurate rate.
          </p>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Home Price", value: homePrice, setter: setHomePrice },
              {
                label: "Down Payment",
                value: downPayment,
                setter: setDownPayment,
              },
              {
                label: "Interest Rate",
                value: interestRate,
                setter: setInterestRate,
                step: "0.01",
              },
              {
                label: "Property Tax",
                value: propertyTax,
                setter: setPropertyTax,
              },
              { label: "HOA Dues", value: hoa, setter: setHoa },
            ].map((item, i) => (
              <div key={i}>
                <label className="block mb-1">{item.label}</label>
                <input
                  type="number"
                  value={item.value}
                  step={item.step || "1"}
                  onChange={(e) => item.setter(+e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 outline-none focus:ring-2 focus:ring-white transition"
                />
              </div>
            ))}
            <div>
              <label className="block mb-1">Term</label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(+e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/30 outline-none focus:ring-2 focus:ring-white transition"
              >
                <option value={30}>30-year fixed</option>
                <option value={25}>25-year fixed</option>
                <option value={20}>20-year fixed</option>
                <option value={15}>15-year fixed</option>
                <option value={10}>10-year fixed</option>
                <option value={5}>5-year fixed</option>
              </select>
            </div>
          </div>

          <button
            onClick={reset}
            className="mt-6 px-4 py-2 bg-white text-[#4e7e7e] font-semibold rounded-lg shadow hover:shadow-lg transition"
          >
            Reset ↻
          </button>
        </div>

        {/* Right Side */}
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center transition transform hover:scale-[1.02]">
          <div className="relative w-48 h-48">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <span className="text-xl font-bold">
                ${totalPayment.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm">Your Payment</span>
            </div>
          </div>
          <div className="mt-8 w-full space-y-2">
            {[
              {
                label: "Principal & Interest",
                color: "#1F5C60",
                value: principalAndInterest,
              },
              { label: "Property Taxes", color: "#5FA6A8", value: propertyTax },
              { label: "HOA Dues", color: "#BFD4D5", value: hoa },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b last:border-none pb-2"
              >
                <span className="font-medium" style={{ color: item.color }}>
                  {item.label}
                </span>
                <span>
                  ${item.value.toLocaleString()} (
                  {Math.round((item.value / totalPayment) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
