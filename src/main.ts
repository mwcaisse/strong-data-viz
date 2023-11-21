// Import bulma
import "bulma/css/bulma.min.css"

// Import bulma theme
// import "bulmaswatch/lux/bulmaswatch.min.css"

import {createApp} from "vue"
import {createPinia} from "pinia"

import {library} from "@fortawesome/fontawesome-svg-core"
import {fas} from "@fortawesome/free-solid-svg-icons"
import {far} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome"

library.add(fas);
library.add(far);

import App from "./App.vue"
import router from "./router"
import {clickOutside} from "@/services/CustomDirectives";

const app = createApp(App)
    .component("FaIcon", FontAwesomeIcon);

app.use(createPinia())
app.use(router)

app.directive("click-outside", clickOutside);

app.mount("#app")
