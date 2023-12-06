import React, { useState, useEffect, Component } from "react";
import Chart from "react-apexcharts";
import "./DonutChart.scss";
import { useSelector } from "react-redux";
import { getTranslatedText as t } from "../../translater";

const DonutChart = (props)=> {
  const state = useSelector((state) => state?.Eddi);

  let lan = state?.language;

const [someData,setSomeData] = useState(props?.state)
const [ongoing,setOngoing] = useState((someData?.is_ongoing_count ? someData?.is_ongoing_count : 0 ))
const  [completed,setCompleted] = useState((someData?.is_completed_count ? someData?.is_completed_count : 0))

    const[data,setData]=useState ({
      series: [(ongoing), (completed)],
      options: {
        chart: {
          type: "donut",
          width: 50,
          height: "50px",
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: '',
                  formatter: () => `${((completed/(ongoing+completed))*100).toFixed()} %`
                }
              }
            }
          }
        },
        dataLabels: {
          formatter: function (val, opts) {
            console.log("val",val,opts);
              // return opts.w.config.series[(ongoing), (completed)]
          },
        },
        
        labels: [`${ongoing} Ongoing`, `${completed} Completed`],
        responsive: [
          {
            breakpoint: 576,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    })

      useEffect(() => {
        let ongoingLet = props?.state?.is_ongoing_count ? props?.state?.is_ongoing_count : 0
        let completedLet = props?.state?.is_completed_count ? props?.state?.is_completed_count : 0
        setSomeData(props?.state)
        setOngoing((props?.state?.is_ongoing_count ? props?.state?.is_ongoing_count : 0 ))
        setCompleted((props?.state?.is_completed_count ? props?.state?.is_completed_count : 0))
        setData({
          series: [(ongoingLet), (completedLet)],
          options: {
            chart: {
              type: "donut",
              width: 50,
              height: "50px",
            },
            dataLabels: {
              formatter: function (val, opts) {
                  // return opts.w.config.series[(ongoingLet), (completedLet)]
              },
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: '',
                      formatter: () => `${((completedLet/(ongoingLet+completedLet))*100).toFixed()} %`
                    }
                  }
                }
              }
            },
            labels: [`${ongoingLet} ${t("Ongoing", lan)}`, `${completedLet} ${t("Completed", lan)} `,],
            responsive: [
              {
                breakpoint: 576,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
        })
  },[props])

    return (
      <div id="chart">
        <Chart
          options={data.options}
          height="330px"
          series={data.series}
          type="donut"
        />
      </div>
    );
  }



export default DonutChart;
