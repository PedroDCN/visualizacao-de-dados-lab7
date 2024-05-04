import * as echarts from "echarts";
import { data, world } from "./data";

echarts.registerMap("world", { geoJSON: world });

const dom = document.getElementById("container");
const inputRangeAno = document.querySelector("#anoSelecionado");
const valorSelecionadoParagrafo = document.querySelector(
  "#valorSelecionadoParagrafo"
);
const botao = document.querySelector("#trocarBotao");

const myChart = echarts.init(dom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});

function criarMapOption(data) {
  var values = data.map((item) => parseFloat(item.value));
  var min = Math.min(...values);
  var max = Math.max(...values);
  return {
    title: {
      text: "Pedidos de patentes por 1 milhão de pessoas",
      left: "center",
    },
    visualMap: {
      left: "right",
      min: min,
      max: max,
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
      text: ["Alto", "Baixo"],
      calculable: true,
    },
    tooltip: {
      trigger: "item",
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: function (params) {
        let label;
        if (params?.data) {
          label = `${params.name}: ${Number(params.data.value).toFixed(5)}`;
          return label;
        } else {
          return undefined;
        }
      },
    },
    series: [
      {
        name: "World PopEstimates",
        type: "map",
        roam: true,
        map: "world",
        animationDurationUpdate: 1000,
        universalTransition: true,
        data: data,
      },
    ],
  };
}

function criarBarOption(data) {
  data = [...data];
  data
    .sort(function (a, b) {
      return a.value - b.value;
    })
    .reverse();
  data = data.splice(0, 10).reverse();
  return {
    title: {
      text: "Pedidos de patentes por 1 milhão de pessoas",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let e = params[0];
        let label = `${e.name}: ${Number(e.data).toFixed(5)}`;
        return label;
      },
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: data.map(function (item) {
        return item.name;
      }),
    },
    animationDurationUpdate: 1000,
    series: {
      type: "bar",
      id: "population",
      data: data.map(function (item) {
        return item.value;
      }),
      universalTransition: true,
    },
  };
}

function init() {
  valorSelecionadoParagrafo.textContent =
    "Ano selecionado: " + inputRangeAno.value;

  let options = {
    current: "map",
    map: criarMapOption(data[inputRangeAno?.value]),
    bar: criarBarOption(data[inputRangeAno?.value]),
  };

  // default map
  myChart.setOption(options.map, true);

  function toggleOption() {
    options.current = options.current === "map" ? "bar" : "map";
    myChart.setOption(options[options.current], true);
  }

  botao.addEventListener("click", toggleOption);

  inputRangeAno.addEventListener("input", function () {
    const anoSelecionado = inputRangeAno?.value;
    valorSelecionadoParagrafo.textContent = `Ano selecionado: ${anoSelecionado}`;
    options.map = criarMapOption(data[anoSelecionado]);
    options.bar = criarBarOption(data[anoSelecionado]);
    myChart.setOption(options[options.current], true);
    myChart.updateLabelLayout();
  });

  window.addEventListener("resize", myChart.resize);
}

init();
