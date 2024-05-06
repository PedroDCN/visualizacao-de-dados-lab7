import * as echarts from "echarts";
import { data, world } from "./data";

echarts.registerMap("world", { geoJSON: world });

const dom = document.getElementById("container");
const inputRangeAno = document.querySelector("#anoSelecionado");
const valorSelecionadoParagrafo = document.querySelector(
  "#valorSelecionadoParagrafo"
);
const botao = document.querySelector("#trocarBotao");

let rangeSelected = "top-10";
const rangeMatch = {
  "top-10": 10,
  "top-30": 30,
  todos: null,
};
const listRangeSelectorContainer = document.querySelector(
  ".list-range-selector"
);
const listRangeSelectorGroup = document.querySelectorAll(
  ".list-range-selector ul li input"
);

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
          "#ffffbb",

          // "#e0f3f8",
          // "#abd9e9",
          // "#74add1",
          // "#4575b4",
          // "#313695",

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

function criarBarOption(data, tam = 10) {
  data = [...data];
  data.sort(function (a, b) {
    return a.value - b.value;
  });
  if (tam) {
    data = data.reverse().splice(0, tam).reverse();
  }
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

    if (options.current === "bar") {
      listRangeSelectorContainer.style.display = "block";
    } else {
      listRangeSelectorContainer.style.display = "none";
    }

    myChart.setOption(options[options.current], true);
  }

  botao.addEventListener("click", toggleOption);

  inputRangeAno.addEventListener("input", function () {
    const anoSelecionado = inputRangeAno?.value;
    valorSelecionadoParagrafo.textContent = `Ano selecionado: ${anoSelecionado}`;
    options.map = criarMapOption(data[anoSelecionado]);
    options.bar = criarBarOption(
      data[anoSelecionado],
      rangeMatch[rangeSelected]
    );
    myChart.setOption(options[options.current], true);
  });

  listRangeSelectorGroup.forEach((button) => {
    button.addEventListener("click", (e) => {
      const anoSelecionado = inputRangeAno?.value;
      rangeSelected = e.target.value || "top-10";
      options.bar = criarBarOption(
        data[anoSelecionado],
        rangeMatch[rangeSelected]
      );
      myChart.setOption(options[options.current], true);
    });
  });

  window.addEventListener("resize", myChart.resize);
}

init();
