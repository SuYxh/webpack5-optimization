
import { App } from "vue";
import { 
    ElButton,
    ElInput
} from 'element-plus'

const elementComponents = [
    ElButton,
    ElInput
]

export default {
    install(app: App) {
      elementComponents.forEach(component => {
        app.component(component.name!, component)
      })
    }
}


