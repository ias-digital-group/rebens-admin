<template>
  <div class="edit-box" v-show="showDashboard">
    <div class="page-header">
      <h2>Dashboard</h2>
    </div>
    <div class="ias-card">
      <div class="ias-dash-row">
        <card type="chart" v-if="benefitViewChart.chartData">
          <template slot="header">
            <h3 class="card-title">Benefícios Mais Vistos</h3>
          </template>
          <div class="chart-area">
            <bar-chart
              style="height: 100%"
              :chart-data="benefitViewChart.chartData"
              :gradient-stops="benefitViewChart.gradientStops"
              :extra-options="benefitViewChart.extraOptions"
            ></bar-chart>
          </div>
        </card>
        <card type="chart" v-if="benefitUseChart.chartData">
          <template slot="header">
            <h3 class="card-title">Benefícios Mais Utilizados</h3>
          </template>
          <div class="chart-area">
            <bar-chart
              style="height: 100%"
              :chart-data="benefitUseChart.chartData"
              :gradient-stops="benefitUseChart.gradientStops"
              :extra-options="benefitUseChart.extraOptions"
            ></bar-chart>
          </div>
        </card>
      </div>
      <dashboard-pie-chart
        v-for="(operation, index) in operationsPieCharts"
        :key="index"
        v-bind:operation="operation"
      ></dashboard-pie-chart>
    </div>
  </div>
</template>
<script>
import DashboardPieChart from '@/components/DashboardPieChart';
import BarChart from '@/components/Charts/BarChart';
import PieChart from '@/components/Charts/PieChart';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';
import reportService from '../../services/Report/reportService';

export default {
  components: {
    BarChart,
    PieChart,
    DashboardPieChart,
  },
  data() {
    return {
      showDashboard: false,
      operationsPieCharts: [],
      benefitViewChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: null,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
      },
      benefitUseChart: {
        extraOptions: chartConfigs.barChartOptions,
        chartData: null,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
      },
    };
  },
  methods: {
    fetchData() {
      const self = this;

      reportService.loadDashboard().then(
        (response) => {
          if (response.data) {
            self.showDashboard = true;
            if (response.data.benefitUse) {
              self.benefitUseChart.chartData = {
                labels: response.data.benefitUse.labels,
                datasets: [
                  {
                    label: response.data.benefitUse.title,
                    fill: true,
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    data: response.data.benefitUse.data,
                  },
                ],
              };
            }
            if (response.data.benefitView) {
              self.benefitViewChart.chartData = {
                labels: response.data.benefitView.labels,
                datasets: [
                  {
                    label: response.data.benefitView.title,
                    fill: true,
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderDash: [],
                    borderDashOffset: 0.0,
                    data: response.data.benefitView.data,
                  },
                ],
              };
            }

            if (response.data.operations) {
              response.data.operations.forEach((element) => {
                let op = {
                  name: element.operation,
                  charts: [],
                };
                if (element.users) {
                  let chart = {
                    title: element.users.title,
                    chartData: {
                      labels: element.users.labels,
                      datasets: [
                        {
                          label: element.users.title,
                          fill: true,
                          borderColor: '#fff',
                          borderWidth: 2,
                          borderDash: [],
                          borderDashOffset: 0.0,
                          data: element.users.data,
                        },
                      ],
                    },
                    extraOptions: chartConfigs.pieChartOptions,
                    gradientStops: [1, 0.4, 0],
                  };
                  op.charts.push(chart);
                }
                if (element.regionState) {
                  let chart = {
                    title: element.regionState.title,
                    chartData: {
                      labels: element.regionState.labels,
                      datasets: [
                        {
                          label: element.regionState.title,
                          fill: true,
                          borderColor: '#fff',
                          borderWidth: 2,
                          borderDash: [],
                          borderDashOffset: 0.0,
                          data: element.regionState.data,
                        },
                      ],
                    },
                    extraOptions: chartConfigs.pieChartOptions,
                    gradientStops: [1, 0.4, 0],
                  };
                  op.charts.push(chart);
                }
                if (element.regionCity) {
                  let chart = {
                    title: element.regionCity.title,
                    chartData: {
                      labels: element.regionCity.labels,
                      datasets: [
                        {
                          label: element.regionCity.title,
                          fill: true,
                          borderColor: '#fff',
                          borderWidth: 2,
                          borderDash: [],
                          borderDashOffset: 0.0,
                          data: element.regionCity.data,
                        },
                      ],
                    },
                    extraOptions: chartConfigs.pieChartOptions,
                    gradientStops: [1, 0.4, 0],
                  };
                  op.charts.push(chart);
                }
                if (element.regionNeighborhood) {
                  let chart = {
                    title: element.regionNeighborhood.title,
                    chartData: {
                      labels: element.regionNeighborhood.labels,
                      datasets: [
                        {
                          label: element.regionNeighborhood.title,
                          fill: true,
                          borderColor: '#fff',
                          borderWidth: 2,
                          borderDash: [],
                          borderDashOffset: 0.0,
                          data: element.regionNeighborhood.data,
                        },
                      ],
                    },
                    extraOptions: chartConfigs.pieChartOptions,
                    gradientStops: [1, 0.4, 0],
                  };
                  op.charts.push(chart);
                }

                self.operationsPieCharts.push(op);
              });
            }
          }
        },
        () => {}
      );
    },
  },
  mounted() {
    this.i18n = this.$i18n;
    this.fetchData();
    if (this.$store.getters.currentUser.role === 'promoter') {
      this.$router.push('/promoter');
    } else if (this.$store.getters.currentUser.role === 'partnerApprover') {
      window.location = '/#/operationPartner/approve';
    }
  },
};
</script>
<style></style>
