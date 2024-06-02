<template>
    <v-container>
        <v-row>
            <v-col cols="1">
            </v-col>
            <v-col cols="10">
                <v-sheet>
                    <div>
                        <h3>회원 정보</h3>

                        <div style="margin-top: 50px;">

                            <div>
                                <span>이메일 : {{ this.memberInfo.email }} / 멤버십 포인트 : {{ Number(this.memberInfo.point).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                            </div>
                            <br>
                            <div>
                                <span>이름</span>
                                <v-text-field v-model="name" label="이름" variant="outlined" style="margin-top: 10px;"></v-text-field>
                            </div>

                            <div>
                                <span>휴대폰 번호</span>
                                <v-text-field v-model="phone" variant="outlined" style="margin-top: 10px;"></v-text-field>
                            </div>

                            
                            <div>
                                <v-row>
                                    <v-col cols="4">
                                    </v-col>

                                    <v-col cols="4">
                                        <v-btn block size="x-large" variant="outlined"  style="margin-top: 10px;" @click="updateMemberInfo()">저장하기</v-btn>
                                    </v-col>
                                    <v-col cols="4">
                                    </v-col>
                                </v-row>
                            </div>

                        </div>

                        <div style="margin-top: 150px;"></div>
                        
                    </div>
                </v-sheet>
            </v-col>
            <v-col cols="1">
            </v-col>
        </v-row>
    </v-container>
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
        memberInfo: [],
        name: null,
        phone: null,
    }),
    methods: 
    {
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
                    if(result.rows)
                    {
                        const rows = JSON.parse(JSON.stringify(result.rows))

                        this.memberInfo = rows[0];
                        this.name = rows[0].name;
                        this.phone = rows[0].phone;
                    }
                    else
                    {
                        alert(result.message)
                    }
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

                        if(result.rows)
                        {
                            const rows = JSON.parse(JSON.stringify(result.rows))

                            this.memberInfo = rows[0];
                            this.name = rows[0].name;
                            this.phone = rows[0].phone;
                        }
                        else
                        {
                            alert(result.message)
                        }
                    });
                }else if(errocode == 401){
                    alert(result.message)
                
                    this.cookies.set("myName", {name: ''});

                    location.reload(true);
                }

            }
        },
        getMemberInfo()
        {
            let myAccesstoken = this.cookies.get("myAccesstoken");
            
            if(myAccesstoken)
            {
                let myRefreshtoken = this.cookies.get("myRefreshtoken");
                let myEmail = this.cookies.get("myEmail");

                const arr = {
                    userEmail: myEmail.email,
                }

                this.$postData("https://www.seomingwan.store/apigateway/member/manage/getMemberInfo", arr, myAccesstoken.accesstoken, myRefreshtoken.refreshtoken, myEmail.email)
                    .then((data) => 
                    {
                        this.refreshTokenCheck(data, `https://www.seomingwan.store/apigateway/member/manage/getMemberInfo`, arr,  data.accesstoken, myRefreshtoken.refreshtoken, myEmail.email);
                    });
            }
            else
            {
                alert('다시 로그인 해주세요')

                this.cookies.set("myName", {name: ''});
                
                location.href = "https://seomingwan.store/membertest?login";
            }
        },
        updateMemberInfo()
        {
            let myAccesstoken = this.cookies.get("myAccesstoken");
            
            if(myAccesstoken)
            {
                let myRefreshtoken = this.cookies.get("myRefreshtoken");
                let myEmail = this.cookies.get("myEmail");

                const arr = {
                    userEmail: myEmail.email,
                    userName: this.name,
                    userPhone: this.phone,
                }

                this.$postData("https://www.seomingwan.store/apigateway/member/manage/updateMemberInfo", arr, myAccesstoken.accesstoken, myRefreshtoken.refreshtoken, myEmail.email)
                    .then((data) => 
                    {
                        this.refreshTokenCheck(data, `https://www.seomingwan.store/apigateway/member/manage/updateMemberInfo`, arr,  data.accesstoken, myRefreshtoken.refreshtoken, myEmail.email);
                    });
            }
            else
            {
                alert('다시 로그인 해주세요')
            }
        },
    },
    mounted() 
    {
        this.getMemberInfo()
    }
}
</script>