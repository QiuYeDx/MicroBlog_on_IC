import { hello } from "../../declarations/hello";

async function post(){
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let text = textarea.value;
  await hello.post(text);
  post_button.disabled = false;
  textarea.value = "";
}
var num_posts = 0;
async function load_posts(){
  let posts_section = document.getElementById("posts");
  let posts = await hello.posts();
  if(num_posts == posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  let head = document.createElement("tr");
  let th_1 = document.createElement("th");
  th_1.setAttribute("style", "text-align: center");
  th_1.innerHTML = "Post";
  let th_2 = document.createElement("th");
  th_2.setAttribute("style", "text-align: center");
  th_2.innerHTML = "Time";
  let th_3 = document.createElement("th");
  th_3.setAttribute("style", "text-align: center");
  th_3.innerHTML = "Author";
  head.appendChild(th_1);
  head.appendChild(th_2);
  head.appendChild(th_3);
  posts_section.appendChild(head);
  for(var i=0;i<posts.length;i++){
    let post = document.createElement("tr");
    let td_1 = document.createElement("td");
    td_1.innerHTML = posts[i].content;
    let td_2 = document.createElement("td");
    td_2.innerHTML = formatDate(Number(posts[i].time)/ 1000000);
    let td_3 = document.createElement("td");
    td_3.innerHTML = posts[i].author;
    post.appendChild(td_1);
    post.appendChild(td_2);
    post.appendChild(td_3);
    posts_section.appendChild(post);
  }
}

function load(){
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_posts();
  setInterval(load_posts, 2500);
}

window.onload = load;

function formatDate(date) {
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}