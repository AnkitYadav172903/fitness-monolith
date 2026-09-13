export const calculateBMI = (height, weight) => {
    if (!height || !weight) return 0;

    const meter = height / 100;
    return (weight / (meter * meter)).toFixed(1);
};

export const bmiStatus = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
};