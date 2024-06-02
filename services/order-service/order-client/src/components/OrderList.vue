<template>
    <v-container>
        <v-row>
            <v-col cols="1">
            </v-col>
            <v-col cols="10">
                <div>
                    <h3>주문내역</h3>
                </div>
                <div style="margin-top: 30px;">
                    <v-row style="padding: 10px;">
                        <v-col cols="7">
                            <div>
                                <span>상품 정보</span>
                            </div>
                        </v-col>
                        <v-col cols="1">
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
                <div
                v-for="(item, i) in orderList"
                :key="i"
                :value="item">
                    <v-row style="padding: 20px;">
                        <v-col cols="7">
                            <div>
                                <span>{{ item.productName }}</span>
                            </div>
                        </v-col>
                        <v-col cols="1">
                            <div style="display: flex; justify-content: center;">
                                <span>{{ item.count }}개</span>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <div style="display: flex; justify-content: center;">
                                <span>{{ (item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</span>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <div style="display: flex; justify-content: center;">
                                <span>{{ (item.deliveryFee).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}원</span>
                            </div>
                        </v-col>
                    </v-row>
                    <hr>
                </div>

            </v-col>
            <v-col cols="1">
            </v-col>
        </v-row>
    </v-container>
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
        data: () => 
        ({
            orderList: []
        }),
        methods: 
        {
            async refreshTokenCheck(response, url, arr, accesstoken, refreshtoken, email)
            {
                const data = JSON.stringify(response)
                const result = JSON.parse(data)
                const rows = JSON.parse(JSON.stringify(result.rows))

                if(result)
                {
                    let errocode = result.code;

                    // accesstoken 이 만료되지 않은 경우
                    if(errocode == 200)
                    {
                        this.orderList = rows
                    }
                    // accesstoken 이 만료되어 refreshtoken 으로 인증을 받고 accesstoken 을 재발급 받은 경우
                    else if(errocode == 201)
                    {
                        this.cookies.set("myAccesstoken", { accesstoken: result.accesstoken});

                        this.$postData(url, arr, accesstoken, refreshtoken, email)
                        .then((data) => 
                        {
                            const data2 = JSON.stringify(data)
                            const result = JSON.parse(data2)
                            const rows = JSON.parse(JSON.stringify(result.rows))

                            this.orderList = rows
                        });
                    }else if(errocode == 401){
                        alert(result.message)
                    
                        this.cookies.set("myName", {name: ''});

                        location.reload(true);
                    }
                }
            },
        },
        mounted() 
        {
            let myAccesstoken = this.cookies.get("myAccesstoken");
            
            if(myAccesstoken)
            {
                let myRefreshtoken = this.cookies.get("myRefreshtoken");
                let myEmail = this.cookies.get("myEmail");
                
                let arr = {
                    userEmail: myEmail.email
                }

                this.$postData("https://www.seomingwan.store/apigateway/order/manage/orderList", arr, myAccesstoken.accesstoken, myRefreshtoken.refreshtoken, myEmail.email)
                .then((data) => 
                {
                    this.refreshTokenCheck(data, `https://www.seomingwan.store/apigateway/order/manage/orderList`, arr,  data.accesstoken, myRefreshtoken.refreshtoken, myEmail.email);
                });
            }
            else
            {
                alert('다시 로그인 해주세요')

                this.cookies.set("myName", {name: ''});
                
                location.href = "https://seomingwan.store/membertest?login";
            }
            
        }
    }
</script>