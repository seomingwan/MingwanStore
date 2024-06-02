<template>
  <v-card
  elevation="0">

    <!-- 관리자 로그인-->
    <v-toolbar
      v-if="this.loginCheck == 2"
      color="white"
    >
      <v-spacer />
      <v-btn
        @click="shop()"
      >
      샵
      </v-btn>
      <v-btn
        @click="gomasterpage()"
      >
      관리자 페이지
      </v-btn>
      <v-btn
        @click="gowarehousepage()"
      >
      재고현황
      </v-btn>
      <v-btn 
        @click="logout()"
      >
      로그아웃
      </v-btn>
    </v-toolbar>

    <!--로그아웃 상태-->
    <v-toolbar
      v-else
      color="white"
    >
      <v-spacer />
      <v-btn
        @click="shop()"
      >
      샵
      </v-btn>
      <v-btn
        @click="login()"
      >
      로그인
      </v-btn>
    </v-toolbar>

  </v-card>
</template>
<script>
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
            returnProductDetail: function() 
            {
                return this.product_detail;
            }
        },
        components: 
        {
            
        },
        data: () => 
        ({
          loginCheck: 0,
          userName: '',
        }),
        methods: 
        {
          login()
          {
            location.href = "https://seomingwan.store/membertest?login";
          },
          shop()
          {
            location.href = "https://seomingwan.store/producttest?master";
          },
          mypage()
          {
            location.href = "https://seomingwan.store/membertest?mypage";
          },
          orderlist()
          {
            location.href = "https://seomingwan.store/ordertest?orderlist";
          },
          cartlist()
          {
            location.href = "https://seomingwan.store/ordertest?cartlist";
          },
          gomasterpage()
          {
            location.href = "https://seomingwan.store/mastertest/";
          },
          gowarehousepage()
          {
            location.href = "https://seomingwan.store/warehousetest/";
          },
          async logout()
          {
            this.cookies.set("myName", {name: ''});

            this.loginCheck = 0;
            
            location.href = "https://seomingwan.store/producttest";
          },
        },
        mounted() 
        { 
          let myName = this.cookies.get("myName");

          if(myName && myName.name != '')
          {
            this.loginCheck = 1;
            this.userName = myName.name;

            if(myName.name == '관리자')
            {
              this.loginCheck = 2;
            }
          }
        },
    }
</script>