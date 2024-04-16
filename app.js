const ajax= new XMLHttpRequest();
const URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
const content = document.createElement("div")
const container = document.getElementById("root")

const ul = document.createElement('ul');
container.appendChild(ul)
container.appendChild(content)

const store = {
    currentPage: 1
}

function newsFeed() {
    const newsFeed = getData(URL)
    const newsList = []
    let template = `
        <div>
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


    for(let i=(store.currentPage-1) * 10 ; i<store.currentPage*10 ;i++) {
    newsList.push(
        `
        <li>
          <a href="#/show/${newsFeed[i].id}">
          ${newsFeed[i].title}  ${newsFeed[i].comments_count}
          </a
        </li>
    `  
    )
    }
    template = template.replace('{{__news_feed__}}', newsList.join(''))
    template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1)
    template = template.replace('{{__next_page__}}', store.currentPage*10 >= newsFeed.length ? store.currentPage : store.currentPage + 1)
    container.innerHTML = template
}

function newsContent(){
    const id = location.hash.substring(7)
    const newsContent = getData(CONTENT_URL.replace('@id', id))

    container.innerHTML = `
      <h1>${newsContent.title}</h1>
      <div>
        <a href="#/page/${store.currentPage}">목록으로</a>
      </div>
    `;
}

function router() {
    const routePath = location.hash;
    console.log(routePath)
    if(routePath === '') {
        newsFeed()
    } else if(routePath.indexOf('#/page') != -1) {
        store.currentPage = Number(location.hash.substring(7))
        newsFeed()
    } else {
        newsContent()
    }
}

function getData(url) {
    ajax.open('GET', url, false)
    ajax.send()
    return JSON.parse(ajax.response)
}

window.addEventListener('hashchange', router)
router()