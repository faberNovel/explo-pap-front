import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const progressBarOptions: Highcharts.Options = {
  chart: {
    type: 'bar',
    height: 100,
    width: 426,
  },

  title: {
    text: `
    <div class="flex flex-row justify-between">
      <div>Manteau</div>
      <div class="flex flex-row justify-between gap-4">
        <div>64 000€</div>
        <div>75%</div>
      </div>
    </div>`,
    align: 'left',
    useHTML: true,
    margin: 0,
    style: {
      display: 'block',
    },
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      /* stacking: 'normal', */
      borderWidth: 0,
      borderRadius: 3,
      pointWidth: 26,
    },
  },
  xAxis: {
    visible: false,
    labels: {
      enabled: false,
    },
  },
  yAxis: {
    visible: true,
    min: 0,
    max: 100,
    title: {
      text: null,
    },
    gridLineWidth: 0,
    labels: {
      enabled: false,
    },
  },
  series: [
    {
      name: '',
      data: [100],
      color: 'gray',
      grouping: false,
      animation: false,
      // enableMouseTracking: false, disable tooltip on just this data element
    },
    {
      label: {
        enabled: false,
      },
      data: [75],
      color: 'orange',
      animation: false,
    },
  ],
};

const barChartOptions: Highcharts.Options = {
  chart: {
    type: 'column',
  },
  title: { text: '' },
  xAxis: {
    type: 'category',
    labels: {
      useHTML: true,
    },
  },
  yAxis: {
    title: {
      text: '',
    },
    labels: {
      enabled: false,
    },
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      /* stacking: 'normal', */
      borderWidth: 0,
      borderRadius: 100,
      pointWidth: 24,
    },
    series: {
      borderWidth: 0,
    },
  },
  tooltip: {
    enabled: false,
  },
  series: [
    {
      name: 'Browsers',
      colorByPoint: true,
      animation: false,
      data: [
        {
          name: `
          <div class='flex flex-col items-center'>
            <div>Slot 1</div>
              <div>22 pièces</div>
              <div>75%</div>
          </div>`,
          y: 63.06,
          drilldown: 'Chrome',
          color: 'orange',
        },
        {
          name: `
          <div class='flex flex-col items-center'>
            <div>Slot 2</div>
              <div>5 pièces</div>
              <div>15%</div>
          </div>`,
          y: 35,
          drilldown: 'Firefox',
          color: 'orange',
        },
        {
          name: `
          <div class='flex flex-col items-center'>
            <div>Slot 3</div>
              <div>1 pièces</div>
              <div>10%</div>
          </div>`,
          y: 24.45,
          drilldown: 'Internet Explorer',
          color: 'orange',
        },
      ],
    },
  ],
};

const StatsPage = () => (
  <div>
    <div style={{ width: '426px' }}>
      <HighchartsReact highcharts={Highcharts} options={progressBarOptions} />
    </div>
    <div style={{ width: '426px' }}>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  </div>
);

export default StatsPage;
