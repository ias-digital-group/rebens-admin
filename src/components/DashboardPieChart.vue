<template>
<div class="row" style="width:100%;margin:0;">
    <div class="col-lg-12">
        <h2>{{operation.name}}</h2>
    </div>
    <div class="col-lg-3" v-for="(chart, index) in operation.charts" :key="index">
    <card type="chart">
        <template slot="header">
        <h3 class="card-title">{{chart.title}}</h3>
            </template>
                <div class="chart-area">
                    <pie-chart
                        style="height: 100%"
                        :chart-data="chart.chartData"
                        :gradient-stops="chart.gradientStops"
                        :extra-options="chart.extraOptions"
                    >
                    </pie-chart>
                </div>
            </card>
        </div>
    </div>
</template>
<script>
import PieChart from '@/components/Charts/PieChart';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';
export default {
  components: {
    PieChart,
  },
  name: 'dashboard-pie-chart',
  props: {
    operation: {}
  }
};
</script>