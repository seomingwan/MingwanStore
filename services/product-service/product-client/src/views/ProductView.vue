<template>
  <product-detail />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import ProductDetail from '../components/ProductDetail.vue';

export default defineComponent({
  name: 'ProductView',

  components: {
    ProductDetail,
  },
});
</script>
