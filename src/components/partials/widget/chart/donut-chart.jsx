import React from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import { colors } from "@/constant/data";

const DonutChart = ({ height = 113,total,completed }) => {
  const [isDark] = useDarkMode();

  function colorOpacity(color, opacity) {
    // coerce values so ti is between 0 and 1.
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  const series = [(completed*100)/total, ((total-completed)*100)/total];

  const options = {
    labels: ["Compleado %", "Proceso %"],
    dataLabels: {
      enabled: false,
    },

    colors: [colors.info, colorOpacity(colors.info, 0.16)],
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Inter",
      fontWeight: 400,
      show: false,
    },

    plotOptions: {
      pie: {
        donut: {
          size: "40%",
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Inter",
              color: isDark ? "#0000" : "#475569",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Inter",
              color: isDark ? "#000000" : "#475569",
              formatter(val) {
                // eslint-disable-next-line radix
                return `${parseInt(val)}%`;
              },
            },
            total: {
              show: true,
              fontSize: "10px",
              label: "",
              color: isDark ? "#0000" : "#0000" ,
              formatter() {
                return (completed*100)/total;
              },
            },
          },
        },
      },
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="pie" height={height} />
    </div>
  );
};

export default DonutChart;
