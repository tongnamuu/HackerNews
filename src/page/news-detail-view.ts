import { NewsDetailApi } from "../core/api";
import View from "../core/view";
import Store from "../store";
import { NewsComment } from "../types";

export default class NewsDetailView extends View {
    private store: Store
    constructor(containerId: string, store: Store) {
        let template =
            `
    <h1 class="text-red-400">{{__newsContent__title__}}</h1>
    <div>
        {{__newsContent__content__}}
    </div>
    {{__comments__}}

    <div>
      <a href="#/page/{{__store__currentPage__}}">목록으로</a>
    </div>

  `
        super(containerId, template)
        this.store = store
    }

    render() {
        const id = location.hash.substring(7)
        const api = new NewsDetailApi()
        const newsContent = api.getData(id);
        for (let i = 0; i < this.store.numberOfFeed; i++) {
            if (this.store.feeds[i].id === Number(id)) {
                this.store.makeRead(i)
                break
            }
        }
        this.setTemplateData('{{__comments__}}', this.makeComment(newsContent.comments, 1))
        this.setTemplateData('{{__newsContent__title__}}', newsContent.title)
        this.setTemplateData('{{__newsContent__content__}}', newsContent.content)
        this.setTemplateData('{{__store__currentPage__}}', String(this.store.currentPage))
        this.updateView();
    }

    private makeComment(comments: NewsComment[], depth: number): string {
        for (let i = 0; i < comments.length; i++) {
            this.addHtml(`
        <div style="padding-left:${depth * 40}px;">
        <div class="text-gray-400">
          <strong>${comments[i].user}</strong>${comments[i].time_ago}
        </div>
        ${comments[i].content}
        </div>
        `)
            if (comments[i].comments.length > 0) {
                this.addHtml(this.makeComment(comments[i].comments, depth + 1))
            }
        }
        return this.getHtml()
    }
}
