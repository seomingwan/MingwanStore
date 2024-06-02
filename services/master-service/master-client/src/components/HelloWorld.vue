<template>
  <div>
    <v-row>
      <v-col cols="5">
      </v-col>
      <v-col cols="2">
        <v-img
          style="display: flex; justify-content: left;"
          src="@/assets/logo.png"
          height="120px"
        ></v-img>
      </v-col>
      <v-col cols="5">
        <main-board />
      </v-col>
    </v-row>
  </div>
  
  <div style="margin-top: 100px;">
    <v-row>
      <v-col cols="2">
      </v-col>
      <v-col cols="2">
        상품 등록
      </v-col>
      <v-col cols="6">

        <div>
          <register-product />
        </div>

      </v-col>
      <v-col cols="2">
      </v-col>
    </v-row>
  </div>

</template>
<script>
  import MainBoard from '@/components/MainBoard.vue'
  import RegisterProduct from '@/components/RegisterProduct.vue'

  import { useCookies } from "vue3-cookies";

  export default 
  {
    setup() 
    {
      const { cookies } = useCookies();
      return { cookies };
    },
    computed: 
    {
      
    },
    components: 
    {
      MainBoard,
      RegisterProduct,
    },
    data: () => 
    ({
      loginCheck: 0,
      userName: '',
    }),
    methods: 
    {
     
    },
    mounted() 
    {
     
    },
  }
</script>