import { useEffect, useState } from 'react'
import { BarChart } from '@mantine/charts';
import ParsedElement from '../interface/ParsedElement';
const Barchart = () => {
    const [chartData, setChartData] = useState<[]>([]);
    useEffect(() => {
        const expensesList = localStorage.getItem("expenses");
        if (expensesList) {
            const parsedData = JSON.parse(expensesList)
            const result = parsedData.map((element: ParsedElement) => ({
                name: element.title.charAt(0).toUpperCase() + element.title.slice(1),
                Price: element.amount,
                category: element.category.charAt(0).toUpperCase() + element.category.slice(1),
                date: element.date,
            }));
            setChartData(result)
        }
    }, []);
    return (
        <>
            <BarChart
                h={200}
                data={chartData}
                dataKey="category"
                orientation="vertical"
                yAxisProps={{ width: 80 }}
                barProps={{ radius: 10 }}
                series={[{ name: 'Price', color: 'violet' }]}
            />
        </>
    )
}

export default Barchart