import Router from "./core/router"
import { NewsDetailView, NewsFeedView } from "./page"
import Store from "./store";




const router: Router = new Router()
const store: Store = new Store()
const newsFeedView = new NewsFeedView('root', store)
const newsDetailView = new NewsDetailView('root', store)

router.addRouterPath('/page/', newsFeedView)
router.addRouterPath('/show/', newsDetailView)
router.setDefaultPage(newsFeedView)
router.route()
