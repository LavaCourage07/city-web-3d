import { useEffect } from "react";
import axios from "axios";
import * as echarts from "echarts";
import "echarts-wordcloud";
import { observer } from "mobx-react";
// import { Title } from "../../components";
import "./index.less";

type EChartsOption = echarts.EChartsOption;

const ROOT_PATH = "src/graph/nearbyAmusement";

const NearbyAmusementView = observer(() => {
  // 词云图
  useEffect(() => {
    const chartDom = document.querySelector(".wordCloud") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        series: [
          {
            type: "wordCloud",
            shape: "circle",
            keepAspect: false,
            // maskImage: maskImage,
            left: "center",
            top: "center",
            width: "100%",
            height: "90%",
            right: null,
            bottom: null,
            sizeRange: [12, 60],
            rotationRange: [0, 0],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            layoutAnimation: true,
            textStyle: {
              fontFamily: "sans-serif",
              fontWeight: "bold",
              // color: function () {
              //   return (
              //     "rgb(" +
              //     [
              //       Math.round(Math.random() * 160),
              //       Math.round(Math.random() * 160),
              //       Math.round(Math.random() * 160),
              //     ].join(",") +
              //     ")"
              //   );
              // },
              color: function () {
                const colorArr = [
                  "#f9f69f",
                  "#f4ca0d",
                  "#ef9126",
                  "#6d70ce",
                  "#d2642d",
                  "#2b2e7d",
                  "#efc391",
                  "#fc9834",
                  "#4f53d3",
                ];
                return colorArr[Math.round(Math.random() * 8)];
              },
              // color: [
              //   "#d2642d",
              //   "#f4ca0d",
              //   "#ef9126",
              //   "#6d70ce",
              //   "#f9f69f",
              //   "#2b2e7d",
              //   "#efc391",
              //   "#fc9834",
              //   "#4f53d3",
              // ],
            },
            emphasis: {
              // focus: 'self',
              textStyle: {
                textShadowBlur: 3,
                textShadowColor: "#333",
              },
            },
            //data属性中的value值却大，权重就却大，展示字体就却大
            data: [
              { name: "陋室公园", value: "25" },
              { name: "文昌塔", value: "21" },
              { name: "陋室铭", value: "9" },
              { name: "镇淮楼", value: "7" },
              { name: "陋室", value: "7" },
              { name: "文庙", value: "6" },
              { name: "南京", value: "4" },
              { name: "马鞍山", value: "3" },
              { name: "望天门山", value: "3" },
              { name: "李白", value: "4" },
              { name: "凤林", value: "3" },
              { name: "三清殿", value: "3" },
              { name: "山不在高", value: "3" },
              { name: "水不在深", value: "3" },
              { name: "有龙则灵", value: "3" },
              { name: "斯是陋室", value: "3" },
              { name: "江天一柱", value: "3" },
              { name: "匾额", value: "3" },
              { name: "人杰地灵", value: "3" },
              { name: "凤林禅寺", value: "2" },
              { name: "鸡笼山", value: "6" },
              { name: "南天门", value: "2" },
              { name: "溶岩洞", value: "2" },
              { name: "上冠巨石", value: "2" },
              { name: "朱元璋", value: "2" },
              { name: "鼓楼", value: "2" },
              { name: "内筑土", value: "2" },
              { name: "外砌砖", value: "2" },
              { name: "宛如城门", value: "2" },
              { name: "依山傍水", value: "2" },
              { name: "风光秀丽", value: "2" },
              { name: "古雅别致", value: "2" },
              { name: "简朴小巧", value: "2" },
              { name: "石铺小院", value: "2" },
              { name: "绿茵遍地", value: "2" },
              { name: "古朴生辉", value: "2" },
              { name: "猿人", value: "2" },
              { name: "有仙则名", value: "2" },
              { name: "唯吾德馨", value: "2" },
              { name: "龙池", value: "2" },
              { name: "戟门", value: "2" },
              { name: "镇江", value: "2" },
              { name: "江淮重镇", value: "2" },
              { name: "镇淮古街", value: "2" },
              { name: "四牌坊", value: "2" },
              { name: "临得胜", value: "2" },
              { name: "绿色之城", value: "1" },
              { name: "诗和远方", value: "1" },
              { name: "灰墙黛瓦", value: "1" },
              { name: "相当精致", value: "1" },
              { name: "诗仙圣境", value: "1" },
              { name: "牌坊朝西", value: "1" },
              { name: "太白碑林", value: "1" },
              { name: "巍巍青山", value: "1" },
              { name: "沉默不语", value: "1" },
              { name: "豪放", value: "1" },
              { name: "草堂集序", value: "1" },
              { name: "地势险要", value: "1" },
              { name: "饮酒", value: "1" },
              { name: "咏诗", value: "1" },
              { name: "流量", value: "1" },
              { name: "明星", value: "1" },
              { name: "浓荫簇拥", value: "1" },
              { name: "环境优雅", value: "1" },
              { name: "一立一坐", value: "1" },
              { name: "太白堂", value: "1" },
              { name: "横江词", value: "1" },
              { name: "牛渚矶", value: "1" },
              { name: "泛舟赏月", value: "1" },
              { name: "跳江捉月", value: "1" },
              { name: "雕梁画栋", value: "1" },
              { name: "别有洞天", value: "1" },
              { name: "凭栏远眺", value: "1" },
              { name: "江天一色", value: "1" },
              { name: "天空乐队", value: "1" },
              { name: "树木成行", value: "1" },
              { name: "草木芳香", value: "1" },
              { name: "缤纷灿烂", value: "1" },
              { name: "湖面蔚蓝", value: "1" },
              { name: "生态堤岸", value: "1" },
              { name: "景致别样", value: "1" },
              { name: "农耕乐园", value: "1" },
              { name: "交相呼应", value: "1" },
              { name: "和道家", value: "1" },
            ],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  // 活力值
  useEffect(() => {
    const chartDom = document.querySelector(".vitalityData") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      myChart.showLoading();

      // 使用 axios 获取数据
      axios
        .get(`${ROOT_PATH}/vitality.json`)
        .then((response) => {
          myChart.hideLoading();
          const graph = response.data;
          const option = {
            backgroundColor: "transparent",
            tooltip: {
              trigger: "axis",
            },
            textStyle: {
              fontSize: 8,
              // color: "red",
            },
            grid: {
              left: "10%",
              right: "10%",
              top: "5%",
              bottom: "30%",
            },
            xAxis: {
              data: graph.map(function (item: string[]) {
                return item[0];
              }),
              nameTextStyle: { fontSize: 20 },
            },
            yAxis: {},
            dataZoom: [
              {
                startValue: "2014-06-01",
              },
              {
                type: "inside",
              },
            ],
            visualMap: {
              top: 5,
              left: 0,
              align: "left",
              itemWidth: 10,
              itemHeight: 10,
              textGap: 5,
              textStyle: {
                fontSize: 8,
              },
              show: false,
              pieces: [
                {
                  gt: 0,
                  lte: 50,
                  color: "#93CE07",
                },
                {
                  gt: 50,
                  lte: 100,
                  color: "#FBDB0F",
                },
                {
                  gt: 100,
                  lte: 150,
                  color: "#FC7D02",
                },
                {
                  gt: 150,
                  lte: 200,
                  color: "#FD0100",
                },
                {
                  gt: 200,
                  lte: 300,
                  color: "#AA069F",
                },
                {
                  gt: 300,
                  color: "#AC3B2A",
                },
              ],
              outOfRange: {
                color: "#999",
              },
            },
            series: {
              name: "永庆坊",
              type: "line",
              data: graph.map(function (item: number[]) {
                return item[1];
              }),
              markLine: {
                silent: true,
                lineStyle: {
                  color: "#ffffff",
                },
                data: [
                  {
                    yAxis: 50,
                  },
                  {
                    yAxis: 100,
                  },
                  {
                    yAxis: 150,
                  },
                  {
                    yAxis: 200,
                  },
                  {
                    yAxis: 300,
                  },
                ],
              },
            },
          };
          myChart.setOption(option);
        })
        .catch((error) => {
          console.error("数据加载失败：", error);
        });
    }
  }, []);

  // 排名榜
  useEffect(() => {
    const chartDom = document.querySelector(".rankingData") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      const option: EChartsOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        backgroundColor: "transparent",
        grid: {
          left: "3%",
          right: "4%",
          top: "5%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  // 人群组成
  useEffect(() => {
    const chartDom = document.querySelector(".peopleData") as HTMLElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom, "dark");
      const option: EChartsOption = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],

            data: [
              { value: 335, name: "Direct" },
              { value: 310, name: "Email" },
              { value: 274, name: "Union Ads" },
              { value: 235, name: "Video Ads" },
              { value: 400, name: "Search Engine" },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            labelLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)",
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };

      myChart.setOption(option);
    }
  }, []);

  return (
    <div>
      {/* <Title text="周边游乐" /> */}
      <div className="chartBox">
        <div className="chart wordCloud"></div>
        <div className="chart historyData grid grid-cols-2">
          <div className="rankingData"></div>
          <div className="peopleData"></div>
        </div>
        <div className="vitalityData"></div>
        {/* <div className="chart transport">
          <div>步行路径推荐：xxxx</div>
          <div>公交路径推荐：xxxx</div>
          <div>地铁路径推荐：xxxx</div>
        </div> */}
      </div>
    </div>
  );
});

export default NearbyAmusementView;
