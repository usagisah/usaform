import "@usaform/element-plus/style.scss"
import "element-plus/dist/index.css"
import { createApp } from "vue"


import App from "./Basic.vue"
// import App from "./Object.vue"
// import App from "./Array.vue"
// import App from "./DynamicNest.vue"
// import App from "./Page.vue"

const app = createApp(App)
app.mount("#app")
