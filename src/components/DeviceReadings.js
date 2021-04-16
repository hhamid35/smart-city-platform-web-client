import { Component, useState, useEffect } from "react"
import { Line } from "react-chartjs-2";
import axios from "axios";
import './Readings.css';
import greenCircle from '../green-circle-emoji.png';
import orangeCircle from '../orange-circle-emoji.png';
import redCircle from '../red-circle-emoji.png';

var util = require('util');

class Readings extends Component {
    constructor() {
        super();
        this.state = {
            ipAddress: '10.0.0.94',
            chartData: {},
            lastReading: {},
            lastPredictionCapacity: 0,
        }
    }
    
    // componentWillMount() {
    //     this.setState({
    //         ipAddress: this.props.deviceIp,
    //     });
    // }

    async componentDidMount() {
        //var t = new Date('04/03/2021 16:04:16');
        //dateFormat(t, '%m/%d/%Y %H:%M:%S');
        let readings_cap = [];
        let readings_time = [];
        let lr = {};
        let lp = 0;
        await axios.get("http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/readings/" + '10.0.0.94')
            .then(res => {
                for(const dataObj of res.data){
                    readings_cap.push(dataObj.capacity);
                    readings_time.push(dataObj.timestamp);
                    
                }
                lr = res.data[res.data.length - 1];
                
            })
            .catch(err => {
                console.log(err);
            })
        readings_cap = readings_cap.splice(readings_cap.length-120);
        readings_time = readings_time.splice(readings_time.length-120);
        console.log(readings_cap.length);
        console.log(readings_time.length);
        let lastTimeStamp = new Date(lr.timestamp);
        let prediction_cap = new Array(readings_cap.length).fill(null);
        let n = 0;
        await axios.get("http://ec2-50-19-241-198.compute-1.amazonaws.com:8080/prediction/" + '10.0.0.94')
            .then(res => {
                var i = 0;
                for(i = 0; i < res.data.length; i++) {
                    prediction_cap.push(res.data[i]);
                    // lastTimeStamp.setHours(lastTimeStamp.getHours() + 1);
                    
                    let timestamp = util.format(
                        '%d/%d/%d %d:%d:%d', 
                        lastTimeStamp.getMonth(),
                        lastTimeStamp.getDay(), 
                        lastTimeStamp.getFullYear(),
                        lastTimeStamp.getHours(), 
                        lastTimeStamp.getMinutes(),
                        lastTimeStamp.getSeconds());
                    readings_time.push(n);
                    n = n + 1;
                }             
                lp = res.data[res.data.length - 1];   
            })
            .catch(err => {
                console.log(err);
            })
        
        console.log(n);
        let lastCap = readings_cap[readings_cap.length - 1];  
        readings_cap = readings_cap.concat(new Array(n).fill(null));
        this.setState({ 
            chartData: {
                labels: readings_time,
                datasets: [
                    {
                        label: "Actual Capacity",
                        data: readings_cap,
                        backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                        borderWidth: 4
                    },
                    {
                        label: "Predicted Capacity",
                        data: prediction_cap,
                        backgroundColor: ["rgba(255, 240, 107, 1)"],
                        borderWidth: 4
                    }
                ]
            },
            lastReading: lr,
            lastPredictionCapacity: lp,
        });
    }

    render() {
        console.log(this.state);
        return (
            <div className="readings">
                <div className="readings-chart">
                    <Line xAxisID = "Time" yAxisID = "Capacity"
                        data={this.state.chartData}
                        options={{
                            responsive: true,
                            title: { text: "Device Capacity - " + this.state.ipAddress, display: true },
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
                <div className="readings-status">
                    <table>
                        <tr>
                            <tb>Last Reading: </tb>
                            <tb>{this.state.lastReading.capacity}</tb>
                        </tr>
                        <tr>
                            <tb>Last Reading Time: </tb>
                            <tb>{this.state.lastReading.timestamp}</tb>
                        </tr>
                        <tr>
                            <tb>Last Known Location: </tb>
                            <tb>[{this.state.lastReading.longitude}, {this.state.lastReading.latitude}]</tb>
                        </tr>
                        <tr>
                            <tb>Current Status: </tb>
                            {this.state.lastReading.capacity < 50 && <tb><img src={greenCircle} alt="Green" width="20" height="20"/></tb>}
                            {this.state.lastReading.capacity >= 50 && this.state.lastReading.capacity < 85  && <tb><img src={orangeCircle} alt="Orange" width="20" height="20"/></tb>}
                            {this.state.lastReading.capacity > 85 && <tb><img src={redCircle} alt="Red" width="20" height="20"/></tb>}
                        </tr>
                        <tr>
                            <tb>Predicted Status: </tb>
                            {this.state.lastPredictionCapacity < 50 && <tb><img src={greenCircle} alt="Green" width="20" height="20"/></tb>}
                            {this.state.lastPredictionCapacity >= 50 && this.state.lastPredictionCapacity < 85  && <tb><img src={orangeCircle} alt="Orange" width="20" height="20"/></tb>}
                            {this.state.lastPredictionCapacity > 85 && <tb><img src={redCircle} alt="Red" width="20" height="20"/></tb>}
                        </tr>
                    </table>
                </div>
            </div>
        </div>);
    }
}

export default Readings;