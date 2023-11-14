// Import bulma
import "bulma/css/bulma.min.css"

// Import bulma theme
// import "bulmaswatch/lux/bulmaswatch.min.css"

import {createApp} from "vue"
import {createPinia} from "pinia"

import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount("#app")
