<template>
  <div>
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="800"
      height="500"
      rounded="lg"
      color="#E9967A"
    >
    
      <h1>Login</h1>
    
      <div style="margin-top: 30px;">
        <div class="text-subtitle-1 text-medium-emphasis">이메일</div>

        <v-text-field
          v-model="email"
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>
      </div>

      <div style="margin-top: 20px;">
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          패스워드
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>
      </div>

      <div style="margin-top: 20px;">
        <v-btn
          block
          class="mb-8"
          color="black"
          size="large"
          variant="tonal"
          @click="login()"
        >
          Log In
        </v-btn>
      </div>

      <div style="margin-top: 20px;">
        <v-card-text class="text-center">
          <a
            class="text-blue text-decoration-none"
            rel="noopener noreferrer"
            target="_blank"
            @click="$emit('close')"
          >
          <span style="color: black;">Sign Up</span>
          </a>
        </v-card-text>
      </div>

    </v-card>
  </div>

  <div style="margin-top: 500px;">
  </div>

</template>
<script>

import { useCookies } from "vue3-cookies";

export default {
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data: () => 
  ({
    visible: false,
    email: null,
    password: null,
  }),
  methods: 
  {
    login()
    {
      this.$postData("https://www.seomingwan.store/apigateway/member/manage/login", 
      { 
        email: this.email, password: this.password
      })
      .then((data) => 
      {
        if(data.code == 401)
        {
          alert('비밀번호가 틀렸습니다.')
        }
        else
        {
          this.cookies.set("myEmail", {email: data.email});
          this.cookies.set("myName", {name: data.name});
          this.cookies.set("myAccesstoken", {accesstoken: data.accesstoken});
          this.cookies.set("myRefreshtoken", {refreshtoken: data.refreshtoken});
          
          location.href = "https://seomingwan.store/producttest/";
        }
        
      });
    },
    signup()
    {
      alert('회원가입')
    }
  }
}
</script>