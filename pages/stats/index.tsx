import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options: Highcharts.Options = {
  title: {
    text: 'My chart',
  },

  series: [
    {
      type: 'line',
      data: [1, 2, 3],
    },
  ],
};

const StatsPage = () => (
  <div>
    <HighchartsReact highcharts={Highcharts} options={options} />
  </div>
);

export default StatsPage;
