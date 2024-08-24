import { useEffect } from "react";
import axios from "axios";
import * as echarts from "echarts";
import { observer } from "mobx-react";
import { useStore } from "../../store";
import { Title } from "../../components";
import { Button } from "antd";
import "./index.less";

interface GraphNode {
  symbolSize: number;
  label?: {
    show?: boolean;
  };
}

type EChartsOption = echarts.EChartsOption;

const HotSpotsView = observer(() => {
  const rootStore = useStore();
  const { count } = rootStore;

  useEffect(() => {
    console.log("useEffect 执行"); // 日志输出
    const chartDom = document.querySelector(".linkChart") as HTMLElement;
    if (chartDom) {
      console.log("找到了 chartDom 元素"); // 日志输出
      const myChart = echarts.init(chartDom);
      myChart.showLoading();

      // 使用 axios 获取数据
      const ROOT_PATH = "src/graph/hotSpot";
      axios
        .get(`${ROOT_PATH}/linkChart.json`)
        .then((response) => {
          myChart.hideLoading();
          const graph = response.data;
          console.log("加载图表成功", graph);

          graph.nodes.forEach(function (node: GraphNode) {
            node.label = {
              show: node.symbolSize > 30,
            };
          });
          const option = {
            color: [
              "#d2642d",
              "#f4ca0d",
              "#ef9126",
              "#6d70ce",
              "#f9f69f",
              "#2b2e7d",
              "#efc391",
              "#fc9834",
              "#4f53d3",
            ],
            title: {
              // text: "热点链接关系",
              textStyle: {
                color: "#ffffff",
                fontSize: "12px",
              },
              // subtext: "Default layout",
              top: "top",
              left: "left",
            },
            tooltip: {},
            legend: [
              {
                // selectedMode: 'single',
                data: graph.categories.map(function (a: { name: string }) {
                  return a.name;
                }),
              },
            ],
            animationDuration: 1500,
            animationEasingUpdate: "quinticInOut",
            series: [
              {
                name: "Les Miserables",
                type: "graph",
                layout: "none",
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                  position: "right",
                  formatter: "{b}",
                },
                lineStyle: {
                  color: "source",
                  curveness: 0.3,
                },
                emphasis: {
                  focus: "adjacency",
                  lineStyle: {
                    width: 10,
                  },
                },
              },
            ],
          };

          myChart.setOption(option);
        })
        .catch((error) => {
          console.error("数据加载失败：", error);
        });
    }
  }, []);

  useEffect(() => {
    const chartDom = document.querySelector(".diff1") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      const option: EChartsOption = {
        textStyle: {
          color: "#ffffff",
          fontFamily: "Microsoft YaHei",
          fontSize: "10",
          fontWeight: "bold",
        },
        backgroundColor: "transparent",
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#ff5e24",
              },
              {
                offset: 0.3,
                color: "#ff9234",
              },
              {
                offset: 1,
                color: "#fbfec1",
              },
            ],
            global: false, // 缺省为 false
          },
        ],
        timeAxis: {
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ffffff",
              // show: false,
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
            },
          },
          minorSplitLine: {
            lineStyle: { color: "#ffffff" },
          },
        },
        logAxis: {
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ffffff",
              // show: false,
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
            },
          },
          minorSplitLine: {
            lineStyle: { color: "#ffffff" },
          },
        },
        valueAxis: {
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ffffff",
              // show: false,
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
            },
          },
          minorSplitLine: {
            lineStyle: { color: "#ffffff" },
          },
        },
        categoryAxis: {
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ffffff",
              // show: false,
            },
          },
          splitArea: {
            areaStyle: {
              color: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"],
            },
          },
          minorSplitLine: {
            lineStyle: { color: "#ffffff" },
          },
        },
        gauge: {
          axisLine: {
            lineStyle: {
              color: "#ffffff",
              // show: false,
            },
          },
        },
        grid: {
          width: "80px",
          height: "auto",
        },

        title: [
          {
            text: "热度",
            textStyle: {
              fontSize: 12,
              color: "#ffffff",
            },
          },
        ],
        polar: {
          radius: [13, "70%"],
        },
        angleAxis: {
          max: 1,
          startAngle: 180,
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        radiusAxis: {
          type: "category",
          data: ["一期", "二期", "三期"],
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        tooltip: {},
        series: {
          type: "bar",
          data: [0.85, 0.6, 0.3],
          coordinateSystem: "polar",
          label: {
            show: true,
            position: "insideStart", // or 'start', 'insideStart', 'end', 'insideEnd'
            formatter: "{b}",
            color: "#ffffff",
            fontSize: "8px",
          },
        },
      };

      myChart.setOption(option);
    }
  }, []);

  useEffect(() => {
    const chartDom = document.querySelector(".diff2") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      const option: EChartsOption = {
        textStyle: {
          color: "#ffffff",
          fontFamily: "Microsoft YaHei",
          fontSize: "10px",
          fontWeight: "bold",
        },
        backgroundColor: "transparent",
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#ff5e24",
              },
              {
                offset: 0.3,
                color: "#ff9234",
              },
              {
                offset: 1,
                color: "#fbfec1",
              },
            ],
            global: false, // 缺省为 false
          },
        ],
        title: [
          {
            text: "店铺数量",
            textStyle: {
              fontSize: 12,
              color: "#ffffff",
            },
          },
        ],
        polar: {
          radius: [13, "70%"],
        },
        angleAxis: {
          max: 60,
          startAngle: 135,
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        radiusAxis: {
          type: "category",
          data: ["一期", "二期", "三期"],
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        tooltip: {},
        series: {
          type: "bar",
          data: [39, 30, 56],
          coordinateSystem: "polar",
          label: {
            show: true,
            position: "insideStart", // or 'start', 'insideStart', 'end', 'insideEnd'
            formatter: "{b}",
            color: "#ffffff",
            fontSize: "8px",
          },
        },
      };

      myChart.setOption(option);
    }
  }, []);

  useEffect(() => {
    const chartDom = document.querySelector(".diff3") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      const option: EChartsOption = {
        textStyle: {
          color: "#ffffff",
          fontFamily: "Microsoft YaHei",
          fontSize: "10px",
          fontWeight: "bold",
        },
        backgroundColor: "transparent",
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#ff5e24",
              },
              {
                offset: 0.3,
                color: "#ff9234",
              },
              {
                offset: 1,
                color: "#fbfec1",
              },
            ],
            global: false, // 缺省为 false
          },
        ],
        title: [
          {
            text: "可达性",
            textStyle: {
              fontSize: 12,
              color: "#ffffff",
            },
          },
        ],
        polar: {
          radius: [13, "70%"],
        },
        angleAxis: {
          max: 1,
          startAngle: 90,
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        radiusAxis: {
          type: "category",
          data: ["一期", "二期", "三期"],
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        tooltip: {},
        series: {
          type: "bar",
          data: [0.7, 0.5, 0.4],
          coordinateSystem: "polar",
          label: {
            show: true,
            position: "insideStart", // or 'start', 'insideStart', 'end', 'insideEnd'
            formatter: "{b}",
            color: "#ffffff",
            fontSize: "8px",
          },
        },
      };

      myChart.setOption(option);
    }
  }, []);

  useEffect(() => {
    const chartDom = document.querySelector(".diff4") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      const option: EChartsOption = {
        textStyle: {
          color: "#ffffff",
          fontFamily: "Microsoft YaHei",
          fontSize: "10px",
          fontWeight: "bold",
        },
        backgroundColor: "transparent",
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#ff5e24",
              },
              {
                offset: 0.3,
                color: "#ff9234",
              },
              {
                offset: 1,
                color: "#fbfec1",
              },
            ],
            global: false, // 缺省为 false
          },
        ],
        title: [
          {
            text: "景点数",
            textStyle: {
              fontSize: 12,
              color: "#ffffff",
            },
          },
        ],
        polar: {
          radius: [13, "70%"],
        },
        angleAxis: {
          max: 10,
          startAngle: 45,
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        radiusAxis: {
          type: "category",
          data: ["一期", "二期", "三期"],
          axisLine: {
            lineStyle: {
              color: "#ffffff",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
          },
        },
        tooltip: {},
        series: {
          type: "bar",
          data: [9, 7, 4],
          coordinateSystem: "polar",
          label: {
            show: true,
            position: "insideStart", // or 'start', 'insideStart', 'end', 'insideEnd'
            formatter: "{b}",
            color: "#ffffff",
            fontSize: "8px",
          },
        },
      };

      myChart.setOption(option);
    }
  }, []);

  return (
    <div>
      {/* <Title text="热点打卡" /> */}
      {/* <div className="count">
        <div>
          <Button onClick={() => count.addCount()}>addCount</Button>
        </div>
        <div>计数:{count.count}</div>
      </div> */}
      <div className="chartBox">
        <div className="chart linkChart"></div>
        <div className="chart areaDiff grid grid-cols-2">
          <div className="diff diff1"></div>
          <div className="diff diff2"></div>
          <div className="diff diff3"></div>
          <div className="diff diff4"></div>
        </div>
      </div>
    </div>
  );
});

export default HotSpotsView;
