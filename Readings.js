import React , { Component, useState, useEffect } from 'react'
import { Chart } from "chart.js"
import { Line } from "react-chartjs-2"
import axios from "axios"


const Readings = () => {
    const [chartData, setChartData] = useState({})
    const [capacity, setCapacity] = useState([])
    const[readingId, setReadingId] = useState([])
    
    const chart = () => {
        /*let empSal = [];
        let empAge = [];
        axios
            .get("http://dummy.restapiexample.com/api/v1/employees")
            .then(res => {
                console.log(res)
                for(const dataObj of res.data.data){
                    empSal.push(dataObj.employee_salary)
                    empAge.push(dataObj.employee_age)
                }*/
        setChartData({
            labels: ['monday', 'tuest','wed','thurs','fri'],
            datasets: [
                {
                    label: "level",
                    data: [32, 45, 12, 76, 69],
                    backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                    borderWidth: 4
                }
            ]
        })
            //})
    }
    useEffect(() => {
        chart()
    }, [])
    return (
        <div className = "App">
            <h1>Readings</h1>
            <div>
                <Line data = {chartData} options = {{
                    responsive: true,
                    title: {text: 'device 1 capacity', display: true},
                    scale: {
                        yAxes: [
                            {
                                ticks: {
                                    autoSkip: true,
                                    maxTicksLimit: 10,
                                    beginAtZero: true
                                },
                                gridLines: {
                                    display: false
                                }
                            }
                        ]
                    }
                }}/>
            </div>
        </div>
    )
}
export default Readings


