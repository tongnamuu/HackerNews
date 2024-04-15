const ajax= new XMLHttpRequest();
const URL = 'https://api.hnpwa.com/v0/news/1.json'
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json'
const content = document.createElement("div")
const container = document.getElementById("root")
ajax.open('GET', URL, false)
ajax.send();
const newsFeed = JSON.parse(ajax.response)

const ul = document.createElement('ul');
container.appendChild(ul)
container.appendChild(content)

window.addEventListener('hashchange', function(){
    const id = this.location.hash.substring(1)
    ajax.open('GET', CONTENT_URL.replace('@id', id), false)
    ajax.send()
    const newsContent = JSON.parse(ajax.response)
    const title = document.createElement('h1')
    content.appendChild(title)
    title.innerHTML = newsContent.title
})

for(let i=0;i<newsFeed.length;i++) {
    const div = document.createElement("div")
    div.innerHTML = `
        <li>
          <a href="#${newsFeed[i].id}">
          ${newsFeed[i].title}  ${newsFeed[i].comments_count}
          </a
        </li>
    `  
    ul.appendChild(div.firstElementChild)
}
