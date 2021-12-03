let page = 1;
const limit = 15;
let pageNav = document.getElementById("pageNav");
let pagEvent = pageNav.addEventListener("click", changePagination);
document.getElementById("modalEditPost").addEventListener("show.bs.modal", createPostModal)
document.getElementById("saveModifiedPost").addEventListener("click", modifyPost)
let last = null
const url = " http://localhost:3000"

async function getPosts() {
 let response = await fetch(
    `${url}/posts?_page=${page}&_limit=${limit}`
  )
  let link = response.headers.get("link")
  let parse = parseData(link)
  last = parse["last"]
  updatePagination(parse)
  console.log(parse)
  let data = await response.json()
  if (data.length > 0) {
    const ul = document.getElementById("ul");
    ul.innerHTML = "";
    data.forEach((element) => {
      const li = document.createElement("li");
      li.innerText = element.title;
      li.classList = "list-group-item";
      li.setAttribute("data-id", element.id);
      ul.appendChild(li);

      li.addEventListener("click", createModal);
    });
  }
};
      


async function createModal() {
  let postId = this.dataset.id;
  let post = await getPost(postId);
  let user = await getUser(post.userId);

  let modalTitle = document.querySelector(".modal-title");
  modalTitle.innerText = post.title;
  let postDiv = document.getElementById("postBody");
  let postBody = document.createElement("p");
  postDiv.innerText = "";
  postBody.innerText = post.body;
  postDiv.appendChild(postBody);

  //User
  let userDiv = document.getElementById("user");
  userDiv.innerText = "";
  let userTitle = document.createElement("h4");
  userTitle.innerText = "USER";
  userDiv.appendChild(userTitle);
  let userName = document.createElement("p");
  userName.innerText = user.username;
  userDiv.appendChild(userName);
  let userEmail = document.createElement("p");
  userEmail.innerText = user.email;
  userDiv.appendChild(userEmail);

  let commentsDiv = document.getElementById("comments");
  commentsDiv.innerText = "";
  let commentButton = document.createElement("button");
  commentButton.innerText = "Load comments";
  commentButton.setAttribute("class", "btn btn-secondary");
  commentButton.setAttribute("data-postId", post.id);
  commentButton.addEventListener("click", showComments);
  commentsDiv.appendChild(commentButton);

  var myModalEl = document.querySelector("#modalPost");
  var modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
  modal.show();

  //event listeners
  document.getElementById("delete").setAttribute("data-postId", post.id)
  document.getElementById("delete").addEventListener("click", deletePost)
  document.getElementById("modify").setAttribute("data-postId", post.id)
}

async function getUser(id) {
  return fetch(`${url}/users/${id}`).then((res) =>
    res.json()
  );
}

async function getPost(id) {
  return fetch(`${url}/posts/${id}`).then((res) =>
    res.json()
  );
}

async function showComments() {
  let commentsDiv = document.getElementById("comments");
  commentsDiv.innerHTML =
    '<button class="btn btn-secondary" type="button" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...</button>';
  let comments = await getComments(this.dataset.postid);
  commentsDiv.innerHTML = "";
  let ul = document.createElement("ul");
  ul.classList = "list-group list-group-flush";
  comments.forEach((element) => {
    let li = document.createElement("li");
    li.classList = "list-group-item";
    let name = document.createElement("p");
    name.innerText = element.name;
    name.style.fontWeight = "bold";
    let body = document.createElement("p");
    body.innerText = element.body;
    let email = document.createElement("p");
    email.innerText = element.email;
    li.appendChild(name);
    li.appendChild(body);
    li.appendChild(email);
    ul.appendChild(li);
  });
  commentsDiv.appendChild(ul);
}

async function getComments(id) {
  return fetch(
    `${url}/posts/${id}/comments`
  ).then((res) => res.json());
}

function changePagination(e) {
  if(e.target.innerText === "Next"){
    if(last != page){
page = e.target.getAttribute("data-page")
getPosts()
}
}
if(e.target.innerText === "Previous"){
  if(page != 1){
page = e.target.getAttribute("data-page")
getPosts()
}
}
}


function parseData(data) {
  let arrData = data.split("link:")
  data = arrData.length == 2? arrData[1]: data;
  let parsed_data = {}

  arrData = data.split(",")

  for (d of arrData){
      linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d)

      parsed_data[linkInfo[2]]=linkInfo[1]
  }
for (const key in parsed_data) {
  parsed_data[key] = parsed_data[key].substring(parsed_data[key].indexOf("=") + 1, parsed_data[key].indexOf("&"))
}
  return parsed_data;
}

function updatePagination(pages){
  let previousElement = document.querySelector("#pageNav li:first-child a")
  let nextElement = document.querySelector("#pageNav li:last-child a")
if (pages.prev){
previousElement.parentElement.classList.remove("disabled")
previousElement.setAttribute("data-page", pages.prev)
}
else {
  previousElement.parentElement.classList.add("disabled")
}
if (pages.next){
  nextElement.parentElement.classList.remove("disabled")
  nextElement.setAttribute("data-page", pages.next)
  }
  else {
    nextElement.parentElement.classList.add("disabled")
  }
  console.log(pages)
}

async function deletePost(e){
let postNun = e.target.getAttribute("data-postId")
 await fetch(`${url}/posts/${postNun}`, {
  method: "DELETE"
}).then(res => {
  if (res.ok){
    var myModalEl = document.querySelector("#modalPost");
  var modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
  modal.hide()
  getPosts()
  }
})
}

function createPostModal(e) {
  document.getElementById("saveModifiedPost").setAttribute("data-postId",  e.relatedTarget.getAttribute("data-postId"))
}

async function modifyPost(e){
let id = e.target.getAttribute("data-postId")
let title = document.getElementById("title").value
let body = document.getElementById("fBody").value

let data = {title: title, body:body}

await fetch(`${url}/posts/${id}`, {
  method: "PATCH",
  headers: {"Content-type":"application/json"},
  body: JSON.stringify(data)
}).then(res => {
  if (res.ok){
    var myModalEl = document.querySelector("#modalEditPost");
  var modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
  modal.hide()
  getPosts()
  }
})
}

getPosts();