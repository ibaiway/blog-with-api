let page = 1;
const limit = 15;
let pageNav = document.getElementById("pageNav")
pageNav.addEventListener("click", changePagination)

function getPosts() {
  fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}` )
    .then((res) => res.json())
    .then((data) => {

        if (data.length > 0){

       
      console.log(data);
      const ul = document.getElementById("ul");
      ul.innerHTML = ""
      data.forEach((element) => {
        const li = document.createElement("li");
        li.innerText = element.title;
        li.classList = "list-group-item";
        li.setAttribute("data-id", element.id);
        ul.appendChild(li);

        li.addEventListener("click", createModal);
      }); }
    });
}

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
  console.log(user);
}

async function getUser(id) {
  return fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) =>
    res.json()
  );
}

async function getPost(id) {
  return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((res) =>
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
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  ).then((res) => res.json());
}

function changePagination(e){
    if (e.target.innerText === "Previous" ){
page--
getPosts()
    }
    else if(e.target.innerText === "Next" ){
        page++
        getPosts()
    }
    else {
      let x = parseInt(e.target.innerText)
      page = x
      getPosts()
    }
}

getPosts();
