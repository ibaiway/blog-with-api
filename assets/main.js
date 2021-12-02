function getPosts() {
  fetch("https://jsonplaceholder.typicode.com/posts/")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const ul = document.getElementById("ul");
      data.forEach((element) => {
        const li = document.createElement("li");
        li.innerText = element.title;
        li.classList = "list-group-item";
        li.setAttribute("data-id", element.id);
        ul.appendChild(li);

        li.addEventListener("click", createModal);
      });
    });
}

async function createModal() {
  let postId = this.dataset.id;
  let post = await getPost(postId);
  let user = await getUser(post.userId);

  let modalTitle = document.querySelector(".modal-title");
  modalTitle.innerText = post.title;
  let postBody = document.createElement("p");
  postBody.innerText = post.body;
  document.getElementById("postBody").appendChild(postBody);

  let userTitle = document.createElement("h4");
  userTitle.innerText = "USER";
  document.getElementById("user").appendChild(userTitle);
  let userName = document.createElement("p");
  userName.innerText = user.username;
  document.getElementById("user").appendChild(userName);
  let userEmail = document.createElement("p");
  userEmail.innerText = user.email;
  document.getElementById("user").appendChild(userEmail);

  let commentButton = document.createElement("button");
  commentButton.innerText = "Load comments";
  commentButton.setAttribute("class", "btn btn-secondary");
  commentButton.setAttribute("data-postId", post.id);
  commentButton.addEventListener("click", showComments);
  document.getElementById("comments").appendChild(commentButton);

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

function showComments() {
  console.log(this.dataset.postid);
}

function cleanModal() {}
getPosts();
