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

    if (calculatedBMI < 18.5) setCategory("Underweight");
    else if (calculatedBMI < 24.9) setCategory("Normal weight");
    else if (calculatedBMI < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };

  // Tailwind custom colors matched approximately to your CSS theme
  // (Better to add them in your tailwind.config.js with the exact hex codes)
  const primaryMain = "bg-yellow-500 hover:bg-yellow-600";
  const primaryLight = "bg-yellow-100";
  const primaryDarkText = "text-yellow-800";

  return (
    <section className="max-w-md mx-auto p-8 rounded-xl shadow-lg bg-yellow-50">
      <h2
        className={`${primaryDarkText} text-3xl mb-6 font-semibold text-center`}
      >
        BMI Calculator
      </h2>

      <label
        className={`${primaryDarkText} font-semibold block mb-1`}
        htmlFor="weight"
      >
        Weight (kg)
      </label>
      <input
        type="number"
        id="weight"
        placeholder="Enter your weight"
        className="w-full p-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6 text-yellow-800 focus:text-black"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        min="1"
      />

      <label
        className={`${primaryDarkText} font-semibold block mb-1`}
        htmlFor="height"
      >
        Height (cm)
      </label>
      <input
        type="number"
        id="height"
        placeholder="Enter your height"
        className="w-full p-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6 text-yellow-800 focus:text-black"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        min="1"
      />

      <button
        className={`${primaryMain} w-full py-3 rounded-2xl text-white font-bold shadow-lg transition-colors`}
        onClick={calculateBMI}
      >
        Calculate BMI
      </button>

      {bmi && (
        <div
          className={`${primaryLight} mt-8 p-5 rounded-xl text-yellow-900 font-semibold text-center`}
          role="region"
          aria-live="polite"
        >
          Your BMI is: <span className="text-2xl">{bmi}</span>
          <div className="mt-2 text-lg">{category}</div>
        </div>
      )}
    </section>
  );
};

export default BMICalculator;
