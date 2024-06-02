<template>

  <v-card
    class="mx-auto pa-12 pb-8"
    elevation="8"
    max-width="800"
    height="500"
    color="#E9967A"
  >

    <h1>Register</h1>

      <v-text-field
        v-model="name"
        color="primary"
        label="이름"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="email"
        color="primary"
        label="Email"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="password"
        color="primary"
        label="Password"
        placeholder="Enter your password"
        variant="underlined"
      ></v-text-field>

      <v-text-field
        v-model="phone"
        color="primary"
        label="전화번호"
        placeholder="Enter your phone"
        variant="underlined"
      ></v-text-field>

      <v-checkbox
        v-model="terms"
        color="secondary"
        label="I agree to site terms and conditions"
      ></v-checkbox>
      


    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn 
      color="black"
      @click="register()"
      >
        등록
      </v-btn>
    </v-card-actions>
  </v-card>

  <div style="margin-top: 650px;">
  </div>

</template>
<script>
  export default {
    data: () => 
    ({
      name: null,
      email: null,
      password: null,
      phone: null,
      group_name: null,
      company_name: null,
      terms: false,
    }),
    methods: {
      async postData(url = "", data = {})
       {
        // Default options are marked with *
        const response = await fetch(url, 
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });

        const result = await response.json();

        return result; // parses JSON response into native JavaScript objects

      },
      register(){
        this.postData("https://www.seomingwan.store/apigateway/member/manage/join", 
        { 
          name: this.name, email: this.email, password: this.password, phone: this.phone, group_name: this.group_name, company_name: this.company_name, terms: this.terms
        })
        .then((data) => 
        {
          alert('회원가입이 완료되었습니다.')
          
          location.href = "https://seomingwan.store/producttest/";
        });
      }
    }
  }
</script>