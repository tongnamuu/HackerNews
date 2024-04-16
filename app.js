const ajax= new XMLHttpRequest();
const URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
const content = document.createElement("div")
const container = document.getElementById("root")

const newsFeed = getData(URL)

const ul = document.createElement('ul');
container.appendChild(ul)
container.appendChild(content)

window.addEventListener('hashchange', function(){
    const id = this.location.hash.substring(1)
    const newsContent = getData(CONTENT_URL.replace('@id', id))

    container.innerHTML = `
      <h1>${newsContent.title}</h1>
      <div>
        <a href="#">목록으로</a>
      </div>
    `;
})

const newsList = []
newsList.push(`<ul>`)
for(let i=0;i<newsFeed.length;i++) {
    newsList.push(
        `
        <li>
          <a href="#${newsFeed[i].id}">
          ${newsFeed[i].title}  ${newsFeed[i].comments_count}
          </a
        </li>
    `  
    )
}
newsList.push(`</ul>`)

container.innerHTML = newsList.join('')


function getData(url) {
    ajax.open('GET', url, false)
    ajax.send()
    return JSON.parse(ajax.response)
}
