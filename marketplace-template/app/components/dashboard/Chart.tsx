"use client"

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"


interface iAppProps {
    data: {
        date: string
        revenue: number
    }[]
}

const aggregateData = (data: { date: string, revenue: number }[]) => {
    const aggregated = data.reduce((acc: Record<string, number>, curr) => {
        if (acc[curr.date]) {
            acc[curr.date] += curr.revenue;
        } else {
            acc[curr.date] = curr.revenue;
        }
        return acc;
    }, {}); 

    // Converts the aggregated object back into an array of objects
    return Object.keys(aggregated).map(date => ({
        date,
        revenue: aggregated[date],
    }));
};


export function Chart({data}: iAppProps){
    const processedData = aggregateData(data)
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ccc' }}
            labelStyle={{ fontWeight: 'bold' }}/>
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" activeDot={{r: 8}}/>
            </LineChart>

        </ResponsiveContainer>
    )
}