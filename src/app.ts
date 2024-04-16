import Router from "./core/router"
import { NewsDetailView, NewsFeedView } from "./page"
import { Store } from "./types"

const store: Store = {
    currentPage: 1,
    feeds: [],
}

declare global {
  interface Window {
     store: Store;
  }
}
window.store = store

const router: Router = new Router()
const newsFeedView = new NewsFeedView('root')
const newsDetailView = new NewsDetailView('root')

router.addRouterPath('/page/', newsFeedView)
router.addRouterPath('/show/', newsDetailView)
router.setDefaultPage(newsFeedView)
router.route()
