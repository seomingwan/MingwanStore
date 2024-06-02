<template>
    <v-container>
        <div v-if="returnProgressBar">
            <progress-bar style="margin-top: 200px;"/>
        </div>
        <div v-else>
            <v-row>
                <v-col cols="1">
                </v-col>
                <v-col cols="10">
                    <div>
                        <h3>주문하기</h3>
                    </div>
                    <div style="margin-top: 30px;">
                        <v-row>
                            <v-col cols="6">
                                <div style="display: flex; justify-content: left;">
                                    <span>상품 정보</span>
                                </div>
                            </v-col>
                            <v-col cols="2">
                                <div style="display: flex; justify-content: center;">
                                    <span>수량</span>
                                </div>
                            </v-col>
                            <v-col cols="2">
                                <div style="display: flex; justify-content: center;">
                                    <span>가격</span>
                                </div>
                            </v-col>
                            <v-col cols="2">
                                <div style="display: flex; justify-content: center;">
                                    <span>배송비</span>
                                </div>
                            </v-col>
                        </v-row>
                    </div>

                    <hr>
                    <v-row
                    v-for="item in productDetail">
                        <v-col cols="3">
                            <v-container>
                                <v-img
                                    :src="(require(`@/uploads/${item.image}`))"
                                    height="200px"
                                ></v-img>
                            </v-container>
                        </v-col>
                        <v-col cols="3">
                            <div style="display: flex; justify-content: center; margin-top: 100px">
                                <span>{{ item.name }}</span>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <div style="display: flex; justify-content: center; margin-top: 100px">
                                <span>{{ this.cnt }}개</span>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <div style="display: flex; justify-content: center; margin-top: 100px">
                                <span>{{ (this.cnt * item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</span>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <div style="display: flex; justify-content: center; margin-top: 100px">
                                <span>{{ Number(item.deliveryFee).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</span>
                            </div>
                        </v-col>
                    </v-row>
                    <hr>

                </v-col>
                <v-col cols="1">
                </v-col>
            </v-row>
            
            <br>
                    
            <v-row>
                <v-col cols="9">
                </v-col>
                <v-col cols="2">
                    <v-btn block size="x-large" variant="outlined"  style="margin-top: 10px;" @click="buyProduct()">주문하기</v-btn>
                </v-col>
                <v-col cols="1">
                </v-col>
            </v-row>
        </div>
        

    </v-container>
</template>
<script>
  import ProgressBar from '@/components/ProgressBar.vue'

  import { useCookies } from "vue3-cookies";

  export default 
  {
    props: {
        cnt: Number
    },
    setup() 
    {
      const { cookies } = useCookies();
      return { cookies };
    },
    components: 
    {
        ProgressBar,
    },
    computed: 
    {
      returnProgressBar: function() 
      {
          return this.prograssbar;
      },
    },
    data: () => 
    ({
      productDetail: [],
      prograssbar: false,
    }),
    methods: 
    {
        // 재고 부족으로 상품 주문이 실패되었는지 여부 확인
        rollbackCheck(arr)
        {
            this.prograssbar = true;
            
            this.$postData("https://www.seomingwan.store/apigateway/anormalyDetection/manage/rollbackRecord", arr)
            .then((data) => 
            {
                switch (data.code) {
                    case 200:
                        alert('주문이 완료되었습니다.');

                        break;
                    case 500:
                        alert('재고가 부족합니다.');
                        
                        break;
                
                    default:
                        break;
                }
                location.href = "https://seomingwan.store/producttest/";
            });

        },
        async refreshTokenCheck(response, url, arr, accesstoken, refreshtoken, email)
        {
            const data = JSON.stringify(response)
            const result = JSON.parse(data)

            if(result)
            {
                let errocode = result.code;

                // accesstoken 이 만료되지 않은 경우
                if(errocode == 200)
                {
                    this.rollbackCheck(arr)
                }
                // accesstoken 이 만료되어 refreshtoken 으로 인증을 받고 accesstoken 을 재발급 받은 경우
                else if(errocode == 201)
                {
                    this.cookies.set("myAccesstoken", { accesstoken: result.accesstoken});

                    this.$postData(url, arr, accesstoken, refreshtoken, email)
                    .then((data) => 
                    {
                        this.rollbackCheck(arr)
                    });
                }else if(errocode == 401){
                    alert(result.message)
                
                    this.cookies.set("myName", {name: ''});

                    location.reload(true);
                }
            }
        },
        buyProduct()
        {
            if(this.productDetail[0].no)
            {
                let myAccesstoken = this.cookies.get("myAccesstoken");
                
                if(myAccesstoken)
                {
                    let myRefreshtoken = this.cookies.get("myRefreshtoken");
                    let myEmail = this.cookies.get("myEmail");

                    const arr = {
                        productNo: this.productDetail[0].no,
                        productName:  this.productDetail[0].name,
                        userEmail: myEmail.email,
                        price: this.cnt * this.productDetail[0].price,
                        cnt: this.cnt,
                        deliveryFee: this.productDetail[0].deliveryFee,
                        point: this.cnt * this.productDetail[0].price * 1/100,
                    }

                    this.$postData("https://www.seomingwan.store/apigateway/order/manage/productOrder", arr, myAccesstoken.accesstoken, myRefreshtoken.refreshtoken, myEmail.email)
                        .then((data) => 
                        {
                            this.refreshTokenCheck(data, `https://www.seomingwan.store/apigateway/order/manage/productOrder`, arr,  data.accesstoken, myRefreshtoken.refreshtoken, myEmail.email);
                        });
                }
                else
                {
                    alert('다시 로그인 해주세요')

                    this.cookies.set("myName", {name: ''});
                    
                    location.href = "https://seomingwan.store/membertest?login";
                }
            }else {
                alert('잘못된 접근입니다.')

                location.href = "https://seomingwan.store/producttest";
            }
        },
    },
    mounted() 
    {
        this.prograssbar = false;

        this.productDetail.push(this.cookies.get("productDetail"))
    }
  }
</script>