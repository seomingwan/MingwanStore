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
    
    <div v-if="returnMyPageStatus">
      <div style="margin-top: 100px;">
        <my-page />
      </div>
    </div>
    <div v-if="returnRegisterStatus">
      <div style="margin-top: 100px;">
        <register-form />
      </div>
    </div>
    <div v-if="returnLoginStatus">
      <div style="margin-top: 100px;">
        <login-form @close="register"/>
      </div>
    </div>

  </div>

</template>
<script>
  import LoginForm from '@/components/LoginForm.vue'
  import RegisterForm from '@/components/RegisterForm.vue'
  import MyPage from '@/components/MyPage.vue'

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
      returnMyPageStatus: function() 
      {
          return this.my_page;
      },
      returnRegisterStatus: function() 
      {
          return this.register_toggle;
      },
      returnLoginStatus: function() 
      {
          return this.login_toggle;
      }
    },
    components: 
    {
      LoginForm,
      RegisterForm,
      MyPage,
    },
    data: () => 
    ({
      my_page: false,
      register_toggle: false,
      login_toggle: false,
      loginCheck: 0,
      userName: '',
      items: [
        { text: 'Real-Time', icon: 'mdi-clock' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' },
      ],
    }),
    methods: 
    {
      shop()
      {
        location.href = "https://seomingwan.store/producttest/";
      },
      mypage()
      {
        this.my_page = true;
        this.register_toggle = false;
        this.login_toggle = false;
      },
      orderlist()
      {
        location.href = "https://seomingwan.store/ordertest?orderlist";
      },
      register()
      {
        this.my_page = false;
        this.register_toggle = true;
        this.login_toggle = false;
      },
      login()
      {
        this.my_page = false;
        this.register_toggle = false;
        this.login_toggle = true;
      },
      async logout()
      {
        this.cookies.set("myName", {name: ''});

        this.loginCheck = 0;

        this.my_page = false;
        this.register_toggle = false;
        this.login_toggle = false;
        
        location.href = "https://seomingwan.store/producttest";
      },
    },
    mounted() 
    {
      let result = window.location.search;

      switch (result) {
        case '?mypage':
          history.pushState(null, null, 'https://seomingwan.store/membertest/')
          this.my_page = true;
          break;
        case '?login':
          history.pushState(null, null, 'https://seomingwan.store/membertest/')
          this.login_toggle = true;
          break;
      }
      
      let myName = this.cookies.get("myName");

      if(myName && myName.name != '')
      {
        this.loginCheck = 1;
        this.userName = myName.name;

        if(myName.name == '관리자')
        {
          location.href = "https://seomingwan.store/mastertest/";
        }
      }
      
    },
  }
</script>