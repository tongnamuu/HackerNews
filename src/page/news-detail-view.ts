import { CONTENT_URL } from "../config";
import { NewsDetailApi } from "../core/api";
import View from "../core/view";
import Store from "../store";
import { NewsComment, NewsDetail } from "../types";

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

    async render(): Promise<void> {
        const id = location.hash.substring(7)
        const api = new NewsDetailApi(CONTENT_URL.replace('@id', id))
        const { title, content, comments } = await api.getData()

        this.store.makeRead(Number(id))
        this.setTemplateData('{{__comments__}}', this.makeComment(comments, 1))
        this.setTemplateData('{{__newsContent__title__}}', title)
        this.setTemplateData('{{__newsContent__content__}}', content)
        this.setTemplateData('{{__store__currentPage__}}', String(this.store.currentPage))
        this.updateView()


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
