<template>
    <div>
        <v-card 
        elevation="0"
        ref="form">
        <v-card-text>
            <br>
            <h2>상품명</h2>
            <br>
            <v-text-field
                v-model="name"
                label="상품명"
                placeholder="상품명"
                required
            ></v-text-field>
            <br>
            <h2>이미지</h2>
            <br>
            <v-file-input
                ref="imageInput"
                placeholder="Upload your documents"
                label="File input"
                prepend-icon="mdi-paperclip"
                @change="onChangeImages"
            >
            <template v-slot:selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                <v-chip
                    size="small"
                    label
                    color="primary"
                    class="me-2"
                >
                    {{ fileName }}
                </v-chip>
                </template>
            </template>
            </v-file-input>
            <br>
            <h2>타입</h2>
            <br>
            <v-text-field
                v-model="typeName"
                label="타입"
                placeholder="타입"
                required
            ></v-text-field>
            <br>
            <h2>가격</h2>
            <br>
            <v-text-field
                v-model="price"
                label="가격"
                placeholder="가격"
                required
            ></v-text-field>
            <br>
            <h2>개수</h2>
            <br>
            <v-text-field
                v-model="count"
                label="개수"
                placeholder="개수"
                required
            ></v-text-field>
            <br>
            <h2>배송비</h2>
            <br>
            <v-text-field
                v-model="deliveryFee"
                label="배송비"
                placeholder="배송비"
                required
            ></v-text-field>

        </v-card-text>

        <v-divider class="mt-12"></v-divider>
        <v-card-actions>
            <v-btn variant="text">
            <h3>취소</h3>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
            color="primary"
            variant="text"
            @click="productRegister()"
            >
            <h3>등록</h3>
            </v-btn>
        </v-card-actions>
        </v-card>
    </div>
    <div style="margin-top: 100px;">
    </div>
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
        data: () => ({
            formHasErrors: false,
            imageFormData: null,
            name: null,
            typeName: null,
            price: null,
            count: null,
            deliveryFee: null,
        }),
        computed: {
        },
        methods: 
        {
            cancel_image()
            {
                this.imageFormData = null;
                this.imageName = null;
                this.name = null;
                this.typeName = null;
                this.price = null;
                this.count = null;
                this.deliveryFee = null;
            },
            async upload(formData) {
                try {
                    const response = await fetch("https://www.seomingwan.store/apigateway/master/manage/productImage", {
                        method: "POST",
                        body: formData,
                    });

                    const result = await response.json();
            
                    this.imageName = result;

                } catch (error) {
                    console.error("실패:", error);
                }
            },
            onChangeImages(e)
            {
                this.imageFormData = new FormData();
                /*
                    e 는 배열이 아니라 유사 배열 (array like object) 이기 때문에 foreach 가 적용이 안된다.
                    그렇기 때문에 여기서 반복문을 강제로 적용하려고 [].forEach.call 을 썻다.
                    최종적으로 FormData 의 형태는 { image: [file1, file2] } 가 된다.
                */
                [].forEach.call(e.target.files, async (f) => 
                {
                    this.imageFormData.append('image', f);
                })

                this.upload(this.imageFormData);
            },
            async refreshTokenCheck(response, url, arr, accesstoken, refreshtoken, email)
            {
                const data = JSON.stringify(response)
                const result = JSON.parse(data)

                // console.log('code : ' + result.code + 'message : ' + result.message)

                if(result)
                {
                    let errocode = result.code;

                    if(errocode == 200)
                    {
                        this.imageName = null;
                        this.name = null;
                        this.typeName = null;
                        this.price = null;
                        this.count = null;
                        this.deliveryFee = null;
                        this.formHasErrors = false;
        
                        alert('상품 등록 완료');

                        location.reload(true);
                    }
                    else if(errocode == 201)
                    {
                        this.cookies.set("myAccesstoken", { accesstoken: result.accesstoken});

                        this.$postData(url, arr, accesstoken, refreshtoken, email)
                        .then((data) => 
                        {
                            this.imageName = null;
                            this.name = null;
                            this.typeName = null;
                            this.price = null;
                            this.count = null;
                            this.deliveryFee = null;
                            this.formHasErrors = false;
            
                            alert('상품 등록 완료');
                            
                            location.reload(true);
                        });
                    }else if(errocode == 401){
                        alert(result.message)
                    
                        this.cookies.set("myName", {name: ''});

                        location.reload(true);
                    }

                }
            },
            productRegister()
            { 
                let myAccesstoken = this.cookies.get("myAccesstoken");
                
                if(myAccesstoken)
                {
                    let myRefreshtoken = this.cookies.get("myRefreshtoken");
                    let myEmail = this.cookies.get("myEmail");
                    let myName = this.cookies.get("myName");

                    const arr = {
                        imageName: this.imageName,
                        name: this.name,
                        typeName: this.typeName,
                        price: this.price,
                        count: this.count,
                        deliveryFee: this.deliveryFee,
                    }

                    this.$postData("https://www.seomingwan.store/apigateway/master/manage/productRegister", arr, myAccesstoken.accesstoken, myRefreshtoken.refreshtoken, myEmail.email)
                        .then((data) => 
                        {
                            this.refreshTokenCheck(data, `https://www.seomingwan.store/apigateway/master/manage/productRegister`, arr,  data.accesstoken, myRefreshtoken.refreshtoken, myEmail.email);
                        });
                }
                else
                {
                    alert('다시 로그인 해주세요')

                    this.cookies.set("myName", {name: ''});
                    
                    location.href = "https://seomingwan.store/membertest?login";
                }

            }
        },
    }
</script>