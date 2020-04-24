<template>
  <div>
    <div class="box-qty">
      <a
        @click="perPageChange(5)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 5,
          'bg-light-gray': perPage !== 5
        }"
        >05</a
      >
      <a
        @click="perPageChange(10)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 10,
          'bg-light-gray': perPage !== 10
        }"
        >10</a
      >
      <a
        @click="perPageChange(25)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 25,
          'bg-light-gray': perPage !== 25
        }"
        >25</a
      >
      <a
        @click="perPageChange(50)"
        class="bt bt-square"
        :class="{
          'bg-light-blue c-white': perPage === 50,
          'bg-light-gray': perPage !== 50
        }"
        >50</a
      >
    </div>
    <div class="box-right">
      <ul class="box-pag">
        <li
          class="bt-arrow"
          v-if="showArrows"
          :class="{ disabled: value === 1 }"
        >
          <a @click="prevPage">
            <svg
              width="15"
              height="24"
              viewBox="0 0 15 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.676452 10.8118L11.5446 0.492523C12.236 -0.16425 13.3569 -0.16425 14.0479 0.492523C14.7389 1.14871 14.7389 2.21299 14.0479 2.86912L4.43122 12.0001L14.0476 21.1308C14.7386 21.7873 14.7386 22.8515 14.0476 23.5077C13.3565 24.1641 12.2357 24.1641 11.5443 23.5077L0.676171 13.1882C0.330638 12.8599 0.158067 12.4302 0.158067 12.0002C0.158067 11.57 0.330975 11.1399 0.676452 10.8118Z"
                fill="#41B0CE"
              />
            </svg>
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
              'bg-light-gray': value !== item
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
          <a @click="nextPage">
            <svg
              width="14"
              height="24"
              viewBox="0 0 14 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3482 10.8118L3.0286 0.492529C2.37215 -0.164242 1.30782 -0.164242 0.651685 0.492529C-0.00450316 1.14872 -0.00450307 2.21299 0.651685 2.86913L9.78297 12.0001L0.651952 21.1309C-0.00423592 21.7873 -0.00423583 22.8515 0.651952 23.5077C1.30814 24.1641 2.37241 24.1641 3.02887 23.5077L13.3485 13.1882C13.6766 12.8599 13.8405 12.4302 13.8405 12.0002C13.8405 11.57 13.6763 11.1399 13.3482 10.8118Z"
                fill="#41B0CE"
              />
            </svg>
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
        <i @click="goToPage" :class="{ disabled: totalPages === 1 }">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.8812 17.7023L14.1937 13.0148C15.2187 11.7315 15.8333 10.1042 15.8333 8.33333C15.8333 4.19166 12.4749 0.833328 8.33325 0.833328C4.19159 0.833328 0.833252 4.19166 0.833252 8.33333C0.833252 12.475 4.19159 15.8333 8.33325 15.8333C10.1041 15.8333 11.7314 15.2187 13.0147 14.1937L17.7022 18.8812C17.8645 19.0437 18.0797 19.125 18.2916 19.125C18.5043 19.125 18.7187 19.0437 18.8812 18.8812C19.206 18.5562 19.206 18.0269 18.8812 17.7023ZM8.33325 14.1667C5.11159 14.1667 2.49992 11.555 2.49992 8.33333C2.49992 5.11166 5.11159 2.49999 8.33325 2.49999C11.5549 2.49999 14.1666 5.11166 14.1666 8.33333C14.1666 11.555 11.5549 14.1667 8.33325 14.1667Z"
              fill="#41B0CE"
            />
          </svg>
        </i>
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
      default: 25
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
