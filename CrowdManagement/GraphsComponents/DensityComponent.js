import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
let itemsArray = [];
const DensityComponent = (props) => {
  const [loading, setLoading] = useState(false)
  const [graphData, setGraphData] = useState("")

  var getData = async () => {
    let result = await props.data
    console.log("result : ", result)
    if (result) {
      setLoading(true)
      for (let i = 0; i < result.Items.length; i++) {
        if (result.Items[i].createdAt) {
          itemsArray.push(result.Items[i]); //pushing only those item which have createdAt field in it. As all the sorting will be done on the basis of createdAt
        }
      }
      // itemsArray.sort((a, b) => a.createdAt - b.createdAt);
      console.log("itemsArray", itemsArray)
      setGraphData(itemsArray)
      // itemsArray.map((val) => setDynamicHeadCount(val.dynamicHeadCount))
    }
  }
  // getData()
  useEffect(() => {
    console.log("itemsArray1", itemsArray)
    getData()

  }, [props])
  const data1 = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100
    }
  ];
  return (
    <div>
      {loading && <AreaChart
        width={650}
        height={100}
        data={graphData}
        margin={{
          top: 2,
          right: 0,
          left: 10,
          bottom: 10
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#53CDF980" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#53CDF980" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1F3BB380" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1F3BB380" stopOpacity={0} />
          </linearGradient>
        </defs>
        {console.log("itemsArray2", graphData)}
        <XAxis style={{
          fontSize: '8px',
          fontFamily: 'Poppins',
        }} />
        <YAxis yAxisId={0} domain={[0, 100]} style={{
          fontSize: '8px',
          fontFamily: 'Poppins',
        }} />
        <YAxis yAxisId={1} orientation="right" domain={[0, 100]} style={{
          fontSize: '8px',
          fontFamily: 'Poppins',
        }} />
        <Tooltip />
        <Area type="monotone" dataKey="densityOfHead" stroke="black" fill="url(#colorUv)" />
        <Area type="monotone" dataKey="dynamicHeadCount" stroke="black" fill="url(#colorUv)" />

      </AreaChart>}
    </div>
  )
}

export default DensityComponent