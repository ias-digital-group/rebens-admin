<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Zanox</h2>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Nome / Restrição</th>
            <th>Tipo / Código</th>
            <th>Inicio / Fim</th>
            <th>Info publicador / Info cliente</th>
            <th>Total / Moeda</th>
            <th>Programa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <div class="two-lines">
                <span>{{ item.name }}</span>
                <span class="blue">{{ item.restrictions }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.incentiveType }}</span>
                <span class="blue">{{ item.couponCode }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.startDate }}</span>
                <span class="blue">{{ item.endDate }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.info4publisher }}</span>
                <span class="blue">{{ item.info4customer }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.total }}</span>
                <span class="blue">{{ item.currency }}</span>
              </div>
            </td>
            <td>{{ item.program.$ }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import zanoxService from '../../services/Zanox/zanoxService';

export default {
  data() {
    return {
      items: [],
      loading: false
    };
  },
  methods: {
    fetchData() {
      const self = this;
      self.items = [];
      self.loading = true;
      zanoxService.getIncentives().then(
        response => {
          self.items = response.incentiveItems.incentiveItem;
          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
table tr td,
table tr th {
  padding: 0 5px !important;
}
</style>
