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
        <v-row
        v-for="item in productDetail">
            <v-col cols="1">
            </v-col>
            <v-col cols="5">

                <v-img
                    :src="(require(`@/uploads/${item.image}`))"
                    height="600px"
                ></v-img>

            </v-col>
            <v-col cols="5">
                <h3>{{ item.name }}</h3>
                <br>
                <br>
                <span>{{ Number(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</span>
                <br>
                <br>
                <h5>배송비 : {{ Number(item.deliveryFee).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</h5>
                <br>
                <br>
                
                <v-row>
                    <v-col cols="2">
                        <span>수량 : </span>
                    </v-col>
                    <v-col cols="2">
                        <input type="text" v-model="cnt" maxlength="10"> 
                    </v-col>
                    <v-col cols="8">
                    </v-col>
                </v-row>

                <br>
                <hr>
                <br>

                <v-row>
                    <v-col cols="2">
                        <h5>주문 수량</h5>
                    </v-col>
                    <v-col cols="8">
                    </v-col>
                    <v-col cols="2">
                        <div style="display: flex; justify-content: right;">
                            {{ this.cnt }}개
                        </div>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                        <h5>총 상품 금액</h5>
                    </v-col>
                    <v-col cols="4">
                    </v-col>
                    <v-col cols="4">
                        <div style="display: flex; justify-content: right;">
                            {{ (this.cnt * item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원
                        </div>
                    </v-col>
                </v-row>

                <br>
                
                <v-row v-if="this.loginCheck == 1">
                    <v-col cols="8">
                    </v-col>
                    <v-col cols="4">
                        <v-btn block size="x-large" variant="outlined"  style="margin-top: 10px;" @click="buyProduct(item.no)">구매하기</v-btn>
                    </v-col>
                </v-row>

            </v-col>
            <v-col cols="1">
            </v-col>
        </v-row>
    </div>
</template>
<script>
    import MainBoard from '@/components/MainBoard.vue'

    import { useCookies } from "vue3-cookies";

    export default {
        name: 'product', 
        setup() 
        {
            const { cookies } = useCookies();
            return { cookies };
        },
        data() {
            return{
                userName: null,
                cnt: 1,
                productDetail: [],
                imageURI: null,
                loginCheck: 0,
                userName: '',
            }
        },
        components: 
        {
            MainBoard,
        },
        methods: 
        {
            buyProduct(productNo)
            {
                location.href = `https://seomingwan.store/ordertest?orderstart&productNo=${productNo}&cnt=${this.cnt}`;
            },
            async check()
            {
                const navigationResult = await this.$router.push('/product')

                if (navigationResult) {
                    // navigation prevented
                    this.$router.go(-1)
                } else {
                    // navigation succeeded (this includes the case of a redirection)
                    this.isMenuOpen = false
                }
            }
        },
        mounted() 
        {
            this.check()

            this.productDetail.push(this.cookies.get("productDetail"))

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