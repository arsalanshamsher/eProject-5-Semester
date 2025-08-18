import React, { useState } from "react";

const BMICalculator = () => {
  const [weight, setWeight] = useState(""); // kg
  const [height, setHeight] = useState(""); // cm
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (!weight || !height) return;
    const heightInMeters = height / 100;
    const calculatedBMI = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBMI.toFixed(2));

    if (calculatedBMI < 18.5) setCategory("⚠️ Underweight");
    else if (calculatedBMI < 24.9) setCategory("✅ Normal weight");
    else if (calculatedBMI < 29.9) setCategory("⚡ Overweight");
    else setCategory("🔥 Obese");
  };

  // Theme colors (using your root palette concept)
  const primaryMain = "from-yellow-500 to-orange-600";
  // const primaryLight = "bg-yellow-100";
  const primaryDarkText = "text-yellow-800";

  return (
    <section className="max-w-lg mx-auto p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
      <h2
        className={`${primaryDarkText} text-4xl font-extrabold text-center mb-6 tracking-wide`}
      >
        BMI Calculator
      </h2>

      {/* Weight Input */}
      <label
        className={`${primaryDarkText} font-semibold block mb-2 text-lg`}
        htmlFor="weight"
      >
        Weight (kg)
      </label>
      <input
        type="number"
        id="weight"
        placeholder="Enter your weight"
        className="w-full p-4 rounded-2xl border border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/60 mb-6 text-yellow-900 shadow-sm transition-all duration-300"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        min="1"
      />

      {/* Height Input */}
      <label
        className={`${primaryDarkText} font-semibold block mb-2 text-lg`}
        htmlFor="height"
      >
        Height (cm)
      </label>
      <input
        type="number"
        id="height"
        placeholder="Enter your height"
        className="w-full p-4 rounded-2xl border border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/60 mb-6 text-yellow-900 shadow-sm transition-all duration-300"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        min="1"
      />

      {/* Calculate Button */}
      <button
        className={`bg-gradient-to-r ${primaryMain} w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transform transition-all duration-300`}
        onClick={calculateBMI}
      >
        Calculate BMI
      </button>

      {/* Result Section */}
      {bmi && (
        <div
          className={`mt-8 p-6 rounded-2xl bg-gradient-to-br from-yellow-200 to-yellow-50 text-yellow-900 font-semibold text-center shadow-inner animate-fadeIn`}
          role="region"
          aria-live="polite"
        >
          <p className="text-xl font-bold mb-2">
            Your BMI is:{" "}
            <span className="text-3xl font-extrabold">{bmi}</span>
          </p>
          <p className="text-lg">{category}</p>
        </div>
      )}
    </section>
  );
};

export default BMICalculator;
