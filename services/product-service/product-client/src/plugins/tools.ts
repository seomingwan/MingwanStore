import { App } from 'vue';

export const getData = {
  install: (app: App) => {
    // 여기에 플러그인의 설치 로직을 작성합니다.
    app.config.globalProperties.$getData = async (url: string) => {
      const response = await fetch(url, 
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "no-cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });

        return response; // parses JSON response into native JavaScript objects
    };
  },
};


export const postData = {
  install: (app: App) => {
    // 여기에 플러그인의 설치 로직을 작성합니다.
    app.config.globalProperties.$postData = async (url: string, data: JSON) => {
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
    };
  },
};