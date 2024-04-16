const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_FEED_URL: string = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL: string = 'https://api.hnpwa.com/v0/item/@id.json'
const content: HTMLElement = document.createElement("div")
const container: HTMLElement = document.getElementById("root")!

const ul = document.createElement('ul');
container!.appendChild(ul)
container!.appendChild(content)


type NewsCommon = {
    id: number;
    time_ago: string;
    title: string;
    url: string;
    user: string;
    content: string
}

type NewsDetail = NewsCommon & {
    comments: NewsComment[];
}

type NewsComment = NewsCommon & {
    comments: NewsComment[];
    level: number;
}

type NewsFeed = NewsCommon & {
    comments_count: number;
    points: number;
    read?: boolean
}

type Store = {
    currentPage: number;
    feeds: NewsFeed[];
}

const store: Store = {
    currentPage: 1,
    feeds: [],
}

function newsFeed() {
    let newsFeed: NewsFeed[] = store.feeds
    const newsList = []
    let template = `
        <div class="container mx-auto p-4">
            <h1>Hacker News</h1>
            <ul>
                {{__news_feed__}}
            </ul>
            <div>
                <a href='#/page/{{__prev_page__}}'>이전페이지</a>
                <a href='#/page/{{__next_page__}}'>다음페이지</a>
            </div>
        </div>
    `
    if (newsFeed.length == 0) {
        newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_FEED_URL))
    }

    for (let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
        newsList.push(
            `
            <li class="${newsFeed[i].read ? 'bg-green-100' : 'bg-white'}">
            <a href="#/show/${newsFeed[i].id}">
            ${newsFeed[i].title}  ${newsFeed[i].comments_count}
            </a
            </li>
        `
        )
    }
    template = template.replace('{{__news_feed__}}', newsList.join(''))
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? String(store.currentPage - 1) : String(1))
    template = template.replace('{{__next_page__}}', store.currentPage * 10 >= newsFeed.length ? String(store.currentPage) : String(store.currentPage + 1))
    container.innerHTML = template
}

function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
    for(let i=0;i<feeds.length;i++) {
        feeds[i].read = false;
    }
    return feeds;
}

function newsContent() {
    const id = location.hash.substring(7)
    const newsContent = getData<NewsDetail>(CONTENT_URL.replace('@id', id))
    let template =
        `
    <h1 class="text-red-400">${newsContent.title}</h1>
    <div>
      ${newsContent.content}
    </div>
    {{__comments__}}

    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>

  `;
    for(let i=0;i<store.feeds.length;i++) {
        if(store.feeds[i].id === Number(id)) {
            store.feeds[i].read = true;
            break
        }
    }  
    template = template.replace('{{__comments__}}', makeComment(newsContent.comments, 1))

    container.innerHTML = template

}

function makeComment(comments: NewsComment[], depth: number): string {
    const commentString = [];
    for (let i = 0; i < comments.length; i++) {
        commentString.push(`
        <div style="padding-left:${depth * 40}px;">
        <div class="text-gray-400">
          <strong>${comments[i].user}</strong>${comments[i].time_ago}
        </div>
        ${comments[i].content}
        </div>
        `)
        console.log(comments[i].content)
        if(comments[i].comments.length > 0) {
            commentString.push(makeComment(comments[i].comments, depth+1))
        }
    }
    return commentString.join('')
}

function router() {
    const routePath = location.hash;

    if (routePath === '') {
        newsFeed()
    } else if (routePath.indexOf('#/page') != -1) {
        store.currentPage = Number(location.hash.substring(7))
        newsFeed()
    } else {
        newsContent()
    }
}

function getData<T>(url: string): T {
    ajax.open('GET', url, false)
    ajax.send()
    return JSON.parse(ajax.response)
}

window.addEventListener('hashchange', router)
router()
