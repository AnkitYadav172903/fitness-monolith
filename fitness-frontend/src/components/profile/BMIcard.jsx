import {
    calculateBMI,
    bmiStatus,
} from "../../utils/bmiCalculator";

export default function BMICard({ height, weight }) {
    const bmi = calculateBMI(height, weight);

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold">
                BMI Calculator
            </h2>

            <div className="grid grid-cols-2 gap-5 mt-6">
                <div>
                    <p className="text-[color:var(--text-secondary)]">Height</p>
                    <h1 className="text-[color:var(--text)] text-3xl font-bold">
                        {height} cm
                    </h1>
                </div>

                <div>
                    <p className="text-[color:var(--text-secondary)]">Weight</p>
                    <h1 className="text-[color:var(--text)] text-3xl font-bold">
                        {weight} kg
                    </h1>
                </div>
            </div>

            <div className="mt-8">
                <h1 className="text-blue-500 text-5xl font-bold">{bmi}</h1>

                <p className="text-green-500 mt-2">{bmiStatus(bmi)}</p>
            </div>
        </div>
    );
}