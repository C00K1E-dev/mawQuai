import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ApacheChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'left',
        textStyle: {
          fontFamily: 'Jost',
          color: 'inherit',
          fontWeight: 'bold',
          fontSize: 15
        }
      },
      series: [
        {
          name: 'MAW Tokenomics',
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: 10,
              name: 'Presale 10%',
              itemStyle: { color: '#ffbaba' },
              label: { color: '#ffbaba', fontSize: 15, fontWeight: 'bold' }
            },
            {
              value: 10,
              name: 'Team 10%',
              itemStyle: { color: '#ff7b7b' },
              label: { color: '#ff7b7b', fontSize: 15, fontWeight: 'bold' }
            },
            {
              value: 5,
              name: 'Reserve 5%',
              itemStyle: { color: '#ff5252' },
              label: { color: '#ff5252', fontSize: 15, fontWeight: 'bold' }
            },
            {
              value: 20,
              name: 'Staking Rewards 20%',
              itemStyle: { color: '#ff0000' },
              label: { color: '#ff0000', fontSize: 15, fontWeight: 'bold' }
            },
            {
              value: 55,
              name: 'Public 55%',
              itemStyle: { color: '#a70000' },
              label: { color: '#a70000', fontSize: 15, fontWeight: 'bold' }
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    // Set the chart option
    myChart.setOption(option);

    // Resize chart when window size changes
    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '490px', marginBottom: '20px' }} />;
};

export default ApacheChart;
