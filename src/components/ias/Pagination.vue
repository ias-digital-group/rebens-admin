<template>
  <div>
    <div hidden class="box-qty">
      <a
        @click="perPageChange(10)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 10,
          'bg-light-gray c-light-blue': perPage !== 10
        }"
        >10</a
      >
      <a
        @click="perPageChange(20)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 20,
          'bg-light-gray c-light-blue': perPage !== 20
        }"
        >20</a
      >
      <a
        @click="perPageChange(30)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 30,
          'bg-light-gray c-light-blue': perPage !== 30
        }"
        >30</a
      >
      <a
        @click="perPageChange(40)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 40,
          'bg-light-gray c-light-blue': perPage !== 40
        }"
        >40</a
      >
      <a
        @click="perPageChange(50)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 50,
          'bg-light-gray c-light-blue': perPage !== 50
        }"
        >50</a
      >
    </div>
    <div class="box-total">
      <p>Total de itens: {{ totalItems }}</p>
    </div>
    <div class="box-right" v-show="totalItems > 0">
      <ul class="box-pag">
        <li
          class="bt-arrow"
          v-if="showArrows"
          :class="{ disabled: value === 1 }"
        >
          <a @click="prevPage" class="c-light-blue">
            <i class="icon-icon-arrow-left"></i>
          </a>
        </li>
        <li
          v-for="item in range(minPage, maxPage)"
          :key="item"
          :class="{ active: value === item }"
        >
          <a
            class="bt bt-square"
            :class="{
              'bg-light-blue c-white': value === item,
              'bg-light-gray c-light-blue': value !== item
            }"
            @click="changePage(item)"
            >{{ item }}</a
          >
        </li>
        <li
          class="bt-arrow"
          v-if="showArrows"
          :class="{ disabled: value === totalPages }"
        >
          <a @click="nextPage" class="c-light-blue">
            <i class="icon-icon-arrow-right"></i>
          </a>
        </li>
      </ul>
      <div class="change-page">
        <input
          type="text"
          v-model="currentPage"
          :class="{ disabled: totalPages === 1 }"
        />
        <span>/ {{ totalPages }}</span>
        <i
          @click="goToPage"
          :class="{ disabled: totalPages === 1 }"
          class="icon-icon-search c-light-blue"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'pagination',
  props: {
    value: {
      type: Number,
      default: 1
    },
    perPage: {
      type: Number,
      default: 10
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    totalItems: {
      type: Number,
      default: 0
    },
    totalPages: {
      type: Number,
      default: 0
    },
    pagesToDisplay: {
      type: Number,
      default: 5
    },
    currentPage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    defaultPagesToDisplay() {
      if (this.totalPages > 0 && this.totalPages < this.pagesToDisplay) {
        return this.totalPages;
      }
      return this.pagesToDisplay;
    },
    minPage() {
      if (this.value >= this.defaultPagesToDisplay) {
        const pagesToAdd = Math.floor(this.defaultPagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage > this.totalPages) {
          return this.totalPages - this.defaultPagesToDisplay + 1;
        }
        return this.value - pagesToAdd;
      } else {
        return 1;
      }
    },
    maxPage() {
      if (this.value >= this.defaultPagesToDisplay) {
        const pagesToAdd = Math.floor(this.defaultPagesToDisplay / 2);
        const newMaxPage = pagesToAdd + this.value;
        if (newMaxPage < this.totalPages) {
          return newMaxPage;
        } else {
          return this.totalPages;
        }
      } else {
        return this.defaultPagesToDisplay;
      }
    }
  },
  methods: {
    range(min, max) {
      let arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    changePage(item) {
      this.$emit('input', item);
    },
    nextPage() {
      if (this.value < this.totalPages) {
        this.$emit('input', this.value + 1);
      }
    },
    prevPage() {
      if (this.value > 1) {
        this.$emit('input', this.value - 1);
      }
    },
    perPageChange(val) {
      this.$emit('update-per-page', val);
    },
    goToPage() {
      if (
        this.currentPage !== this.value &&
        this.currentPage > 0 &&
        this.currentPage <= this.totalPages
      ) {
        this.value = parseInt(this.currentPage);
        this.$emit('input', this.value);
      } else {
        this.currentPage = this.value;
      }
    }
  }
};
</script>
