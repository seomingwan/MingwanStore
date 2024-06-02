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
        <v-card
        elevation="0">

          <!--일반유저 로그인-->
          <v-toolbar
            v-if="this.loginCheck == 1"
            color="white"
          >
            <v-spacer />
            <v-btn
              @click="shop()"
            >
            샵
            </v-btn>
            <v-btn
              @click="mypage()"
            >
            마이페이지
            </v-btn>
            <v-btn
              @click="orderlist()"
            >
            주문내역
            </v-btn>
            <v-btn 
              @click="logout()"
            >
            로그아웃
            </v-btn>
          </v-toolbar>
          
          <!-- 관리자 로그인-->
          <v-toolbar
            v-else-if="this.loginCheck == 2"
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
      </v-col>
    </v-row>
    
    <div v-if="returnOrderList">
      <div style="margin-top: 100px;">
        <order-list />
      </div>
    </div>
    <div v-if="returnOrderStart">
      <div style="margin-top: 100px;">
        <order-start :cnt="cnt" />
      </div>
    </div>

  </div>
  
</template>
<script>
  import OrderList from '@/components/OrderList.vue'
  import OrderStart from '@/components/OrderStart.vue'

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
      returnOrderList: function() 
      {
          return this.order_list;
      },
      returnOrderStart: function() 
      {
          return this.order_start;
      }
    },
    components: 
    {
      OrderList,
      OrderStart,
    },
    data: () => 
    ({
      loginCheck: 0,
      userName: '',
      cart_list: false,
      order_list: false,
      order_start: false,
      cnt: null,
    }),
    methods: 
    {
      shop()
      {
        location.href = "https://seomingwan.store/producttest/";
      },
      mypage()
      {
        location.href = "https://seomingwan.store/membertest?mypage";
      },
      orderlist()
      {
        location.href = "https://seomingwan.store/ordertest?orderlist";
      },
      login()
      {
        location.href = "https://seomingwan.store/membertest?login";
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
      let url = new URL(window.location.href);
      
      let productNo = url.searchParams.get('productNo')
      this.cnt = url.searchParams.get('cnt')

      let result = (window.location.search).split('&productNo=')[0];

        switch (result) {
          case '?orderlist':
            this.order_list = true;
            this.order_start = false;
            
            history.pushState(null, null, 'https://seomingwan.store/ordertest/')
            break;

          case '?orderstart':
            
            this.$postData("https://www.seomingwan.store/apigateway/product/manage/productOne", 
              { 
                no: productNo
              })
              .then((data) => 
              {
                const rows = JSON.stringify(data.rows);

                const result = JSON.parse(rows);

                this.cookies.set("productDetail", result);
              });

            history.pushState(null, null, 'https://seomingwan.store/ordertest/')
            this.order_list = false;
            this.order_start = true;

            break;
      }

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