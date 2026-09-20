import { Droplet } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WaterTracker() {
    const [water, setWater] = useState(() => {
        return Number(localStorage.getItem("water")) || 5;
    });

    useEffect(() => {
        localStorage.setItem("water", water);
    }, [water]);

    const percent = (water / 8) * 100;

    return (
        <div className="surface border border-theme rounded-3xl p-6 h-full">
            <div className="flex justify-between">
                <h2 className="text-[color:var(--text)] text-xl font-bold">
                    Water Intake
                </h2>

                <Droplet className="text-cyan-400" />
            </div>

            <div className="relative h-44 mt-6 rounded-2xl overflow-hidden surface-secondary border border-theme">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-cyan-400"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h1 className="text-5xl font-bold text-[color:var(--text)]">
                        {water}/8
                    </h1>

                    <p className="text-[color:var(--text-secondary)] mt-1">
                        Glasses Today
                    </p>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={() =>
                        water > 0 && setWater(water - 1)
                    }
                    className="bg-red-600 px-4 py-2 rounded-lg text-white"
                >
                    −
                </button>

                <button
                    onClick={() =>
                        water < 8 && setWater(water + 1)
                    }
                    className="bg-cyan-600 px-4 py-2 rounded-lg text-white"
                >
                    +
                </button>
            </div>
        </div>
    );
}