import { PieChart, Pie, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

interface ElementItem {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
}

interface ChartData {
    name: string;
    value: number;
    category: string;
    date: string;
    id: string;
}

const Chart = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        const expensesList = localStorage.getItem("expenses");
        if (expensesList) {
            const parsedData = JSON.parse(expensesList) as ElementItem[];
            const result = parsedData.map((element: ElementItem) => ({
                name: element.title.charAt(0).toUpperCase() + element.title.slice(1),
                value: element.amount, // Updated key to `value`
                category: element.category,
                date: element.date,
                id: element.id,
            }));
            setChartData(result);
        }
    }, []);

    return (
        <>
            <PieChart width={300} height={300}>
                <Pie
                    dataKey="value"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#FF9304"
                    label
                />
                <Tooltip />
            </PieChart>
        </>
    );
};

export default Chart;
