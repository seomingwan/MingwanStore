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
      <v-col cols="1">
      </v-col>
      <v-col cols="1">

          <div>
            <span @click="goMenList()">남성복</span>
          </div>
          <br>
          <div>
            <span @click="goWomenList()">여성복</span>
          </div>

      </v-col>
      <v-col cols="9">

        <div v-if="returnMenList">
          <men-list/>
        </div>
        <div v-if="returnWomenList">
          <women-list />
        </div>

      </v-col>
      <v-col cols="1">
      </v-col>
    </v-row>
  </div>

  <div style="margin-top: 300px;">

  </div>

</template>
<script>
  import MainBoard from '@/components/MainBoard.vue'
  import MenList from '@/components/MenList.vue'
  import WomenList from '@/components/WomenList.vue'

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
      returnMenList: function() 
      {
        return this.men_list;
      },
      returnWomenList: function() 
      {
        return this.women_list;
      },
    },
    components: 
    {
      MainBoard,
      MenList,
      WomenList,
    },
    data: () => 
    ({
      loginCheck: 0,
      men_list: true,
      women_list: false,
    }),
    methods: 
    {
      goMenList()
      {
        this.men_list = true;
        this.women_list = false;

        this.$store.state.productType = 'men_list'
      },
      goWomenList()
      {
        this.men_list = false;
        this.women_list = true;
        
        this.$store.state.productType = 'women_list'
      },
    },
    mounted() 
    {
      switch (this.$store.state.productType) {
        case 'men_list':
          this.men_list = true;
          this.women_list = false;

          break;

        case 'women_list':
          this.men_list = false;
          this.women_list = true;
          
          break;
      
        default:
          break;
      }
    },
  }
</script>