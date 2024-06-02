<template>
  <div>
    <h2>여성복</h2>
    <v-row>
      <v-col
      v-for="item in productList"
      cols="12"
      md="2"
      >
        <div>
          <v-img
            :src="(require(`@/uploads/${item.image}`))"
            @click="goProductDetail(item.no)"
            height="300px"
          ></v-img>
          <span>{{ item.name }}</span>
          <br>
          <br>
          <span>{{ (item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import { useCookies } from "vue3-cookies";

  export default {
    setup() 
    {
      const { cookies } = useCookies();
      return { cookies };
    },
    data: () => ({
      productList: []
    }),
    methods:
    {
      goProductDetail(no)
      {
        this.$postData("https://www.seomingwan.store/apigateway/product/manage/productOne", 
        { 
          no: no
        })
        .then((data) => 
        {
          this.cookies.set("productDetail", data.rows[0]);
          
    	    this.$router.push('/product');
        });

      },
    },
    mounted()
    {
      this.$postData("https://www.seomingwan.store/apigateway/product/manage/productList", 
      { 
        typeName: '여성복'
      })
      .then((data) => 
      {
        const rows = JSON.stringify(data.rows);

        const result = JSON.parse(rows);

        this.productList = result;
      });
        
    }
  }
</script>