import React, { useState, useEffect } from "react"
import { Line } from "react-chartjs-2";
import axios from "axios";
import './Readings.css'

const Readings = () => {
  const [chartData, setChartData] = useState({});

  const chart = () => {
    let cap = []
    let time = []
    axios.get("http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/readings")
      .then(res => {
        console.log(res);
        for(const dataObj of res.data){
          cap.push(dataObj.capacity);
          time.push(dataObj.timestamp);
        }
        setChartData({
          labels: time,
          datasets: [
            {
              label: "garbage capacity",
              data: cap,
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderWidth: 4
            }
          ]
        });
      })
      .catch(err => {
        console.log(err);
      })
      console.log(time, cap)
    
  }

  useEffect(() => {
    chart();
  }, []);
  return (
    <div className="App">
      <div>
        <Line xAxisID = "Reading Id" yAxisID = "Capacity"
          data={chartData}
          options={{
            responsive: true,
            title: { text: "Device Capacity", display: true },
            scales: {
              yAxes: [
                {
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    beginAtZero: true
                  },
                  gridLines: {
                    display: true
                  },
                  label: 'Capacity'
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: true
                  }
                }
              ]
            }
          }}
        />
      </div>
    </div>
  );
};

export default Readings;