let form = document.querySelector(".form")
let searchInput = document.querySelector(".search-input")
let elList = document.querySelector(".list")
let bookmarList = document.querySelector(".bookmark-list")
let fullArr
let modal = document.querySelector(".modal")
let overlay = document.querySelector(".overlay")
let sort = document.querySelector(".sort-btn")
let page = 1
let maxResults = 10
let search = 'php'
let orderBy = "relevance"
let numberResult = document.querySelector(".number-result")
let showingResult = document.querySelector(".number-showing")
let localStorageBookmark = JSON.parse(window.localStorage.getItem("bookmark"))
let pagination = document.querySelector(".pagination")

let bookmarkArr = localStorageBookmark || []

sort.addEventListener("click", function (e) {
    orderBy = "newest"
    getBook()
})

form.addEventListener("submit", function (e) {
    e.preventDefault()
    let searchValue = searchInput.value
    search = searchValue
    searchInput.value = null
    getBook()
})


let getBook = async function () {
    let request = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&maxResults=${maxResults}&orderBy=${orderBy}`)
    let data = await request.json()
    fullArr = data.items
    elList.innerHTML = null

    renderPage(data, pagination)

    if (data.items && data.items.length > 0) {
        renderBook(fullArr, elList)
        numberResult.textContent = data.totalItems
        showingResult.textContent = data.items.length
    } else {
        alert("bunday kitob topilmadi")
    }

}

getBook()

elList.addEventListener("click", function(e){
   console.log( e.target.dataset.id);
})

let renderBook = function (arr, htmlElement) {
    arr.forEach(e => {
        let card = document.createElement("li")
        card.setAttribute("class", "card")
        htmlElement.appendChild(card)

        let item = `
        <div class="card-box-img">
            <img class="card-img" width="200" height="200" src="${e.volumeInfo.imageLinks.thumbnail}" alt="">
        </div>
        <h4 class="card__title">${e.volumeInfo.title}</h4>
        <p data-id=${e.id} class="card__author">${e.volumeInfo.authors}</p>
        <p class="card__date">${e.volumeInfo.publishedDate}</p>
        `

        
        card.insertAdjacentHTML("beforeend", item)

        let cardBoxBtn = document.createElement("div")
        let bookAndInfo = document.createElement("div")

        let bookmarkBtn = document.createElement("button")
        let infoBtn = document.createElement("button")
        let readBtn = document.createElement("a")

        bookmarkBtn.textContent = "Bookmark"
        infoBtn.textContent = "More info"
        readBtn.textContent = "Read"

        bookmarkBtn.setAttribute("class", "bookmark-btn")
        infoBtn.setAttribute("class", "info-btn")
        readBtn.setAttribute("class", "read-link")
        readBtn.setAttribute("href", e.volumeInfo.infoLink)
        readBtn.setAttribute("target", "_blank")
        cardBoxBtn.setAttribute("class", "card-box-btn")

        bookmarkBtn.dataset.bookmarkBtnId = e.id
        infoBtn.dataset.infoBtnId = e.id

        card.appendChild(cardBoxBtn)
        cardBoxBtn.appendChild(bookAndInfo)
        bookAndInfo.appendChild(bookmarkBtn)
        bookAndInfo.appendChild(infoBtn)
        cardBoxBtn.appendChild(readBtn)
    });

}


elList.addEventListener("click", function (e) {
    e.preventDefault()

    if (e.target.matches(".bookmark-btn")) {

        let bookmarkId = e.target.dataset.bookmarkBtnId

        let foundBookmark = fullArr.find(item => item.id === bookmarkId)

        if (!bookmarkArr.includes(foundBookmark)) {
            bookmarkArr.push(foundBookmark)
            window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArr))
        }
        bookmarList.innerHTML = null
        renderBookmark(bookmarkArr, bookmarList)
    }
})

let renderBookmark = function (arr, htmlElement) {

    arr.forEach(e => {

        let bookmarkItem = document.createElement("li")

        bookmarkItem.setAttribute("class", "bookmark__item")

        htmlElement.appendChild(bookmarkItem)

        html = `
        <div>
            <p class="bookmark__item-name">${e.volumeInfo.title}</p>
            <p class="bookmark__item-author">${e.volumeInfo.authors}</p>
        </div>
        `

        bookmarkItem.insertAdjacentHTML("beforeend", html)

        let div = document.createElement("div")
        let openBtn = document.createElement("a")
        let openImg = document.createElement("img")
        let deleteBtn = document.createElement("button")
        let deleteImg = document.createElement("img")

        div.setAttribute("class", "buttons")
        openBtn.setAttribute("class", "open-btn")
        openBtn.setAttribute("href", e.volumeInfo.infoLink)
        openImg.setAttribute("class", "open-img")
        openImg.setAttribute("src", "./images/book-open1.png")
        deleteBtn.setAttribute("class", "delete-btn")
        deleteImg.setAttribute("class", "delete-img")
        deleteImg.setAttribute("src", "./images/delete1.png")

        deleteBtn.dataset.deleteBtnId = e.id
        deleteImg.dataset.deleteImgId = e.id

        bookmarkItem.appendChild(div)
        div.appendChild(openBtn)
        openBtn.appendChild(openImg)
        div.appendChild(deleteBtn)
        deleteBtn.appendChild(deleteImg)
    });
    window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArr))
}

bookmarList.addEventListener("click", function (e) {

    if (e.target.matches(".delete-btn") || e.target.matches(".delete-img")) {

        let deleteId = e.target.dataset.deleteBtnId
        let deleteImgId = e.target.dataset.deleteImgId

        let foundDeleteIndex = bookmarkArr.findIndex(i => i.id === deleteId || i.id === deleteImgId)

        bookmarkArr.splice(foundDeleteIndex, 1)

        bookmarList.innerHTML = null

        window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArr))

        renderBookmark(bookmarkArr, bookmarList)

        if (bookmarkArr.length === 0) {

            window.localStorage.removeItem("bookmark")

        }

    }
})
renderBookmark(bookmarkArr, bookmarList)
let modalBox = document.querySelector(".modal-box")

let renderModal = function (e, htmlElement) {
    htmlElement.appendChild(modalBox)

    let html = `
        <div class="modal-header">
        <p>${e.volumeInfo.title}</p>
        <i class="fa-solid fa-xmark"></i>
    </div>
    <div class="modal-body">
        <img src="${e.volumeInfo.imageLinks.thumbnail}" width="200.96px" height="240.59px" alt="">
        <p class="modal-desc">${e.volumeInfo.description}</p>

        <div style="width: 100%;">
            <div class="modal-body_data">
                <p class="data__authors">Author : </p> <span class="modal__authors-name">${e.volumeInfo.authors || "undefined"}</span>
            </div>
            <div class="modal-body_data">
                <p class="data__publish">Published : </p> <span class="modal__publish-name">${e.volumeInfo.publishedDate || "undefined"}</span>
            </div>
            <div class="modal-body_data">
                <p class="data__publisher">Publishers: </p> <span
                    class="modal__publisher-name">${e.volumeInfo.publisher}</span>
            </div>
            <div class="modal-body_data">
                <p class="data__category">Categories: </p> <span
                    class="modal__category-name">${e.volumeInfo.categories}</span>
            </div>
            <div class="modal-body_data">
                <p class="data__page-count">Pages Count: </p> <span class="modal__category-name">${e.volumeInfo.pageCount}</span>
            </div>
        </div>
    </div>
        `
    modalBox.insertAdjacentHTML("beforeend", html)
}

elList.addEventListener("click", function (e) {
    if (e.target.matches(".info-btn")) {
        modal.style.display = "block"
        overlay.style.visibility = "visible"

        let infoId = e.target.dataset.infoBtnId
        let foundInfo = fullArr.find(item => item.id === infoId)

        modalBox.innerHTML = null
        renderModal(foundInfo, modal)
    }
})

overlay.addEventListener("click", function (e) {
    e.preventDefault()
    overlay.style.visibility = "hidden"
    modal.style.display = "none"
})

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) {
        overlay.style.visibility = "hidden"
        modal.style.display = "none"
    }
})

let oldiga = document.querySelector(".oldiga")
let orqaga = document.querySelector(".orqaga")

oldiga.addEventListener("click", function (e) {
    e.preventDefault()

    if (page>0) {
        page +=10
        getBook()    
    }

})

orqaga.addEventListener("click", function (e) {
    e.preventDefault()
    if (page>0) {
        page -=10
        getBook()
        console.log(page);
    }

    else if (page <= 1 ) {
        orqaga.disable = true
    }

})


let renderPage = function (arr, htmlElement) {

    for (let i = 0 ; i <= Math.ceil(arr.totalItems / 10); i++) {

        let pageBtn = document.createElement("button")
        pageBtn.setAttribute("class", "page-btn")

        pageBtn.textContent = i

        htmlElement.appendChild(pageBtn)

        pageBtn.addEventListener("click", function () {

            page = (i*10)+1

            getBook()

            console.log(page);

        })

    }

}
