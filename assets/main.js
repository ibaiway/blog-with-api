function getPosts() {
    fetch("https://jsonplaceholder.typicode.com/posts/")
    .then( res => res.json())
    .then(data => { console.log(data)
        const ul = document.getElementById("ul")
        data.forEach(element => {
            const li = document.createElement("li")
            li.innerText = element.title
            li.classList = "list-group-item"
            li.setAttribute("data-id", element.id)
            ul.appendChild(li)

            li.addEventListener("click", createModal)
        });
    })
    
}

async function createModal() {
    let postId = this.dataset.id
let post = await getPost(postId)
let user = await getUser(post.userId)

let modalTitle = document.querySelector(".modal-title")
modalTitle.innerText = post.title
var myModalEl = document.querySelector('#modalPost')
var modal = bootstrap.Modal.getOrCreateInstance(myModalEl)

modal.show()
console.log(user)
}

async function getUser(id) {
 return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
 .then(res => res.json())

}

async function getPost(id) {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(res => res.json())
   
   }
getPosts()