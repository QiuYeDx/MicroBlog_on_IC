import { hello } from "../../declarations/hello";

var flag = "myself";
var flag_name = "";
let follows;

async function post(){
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let text = textarea.value;
  await hello.post(text);
  post_button.disabled = false;
  load_posts();
  textarea.value = "";
  flag = "myself";
}
var num_posts = 0;
var flag_last = "myself";
async function load_posts(){
  let posts_section = document.getElementById("posts");
  let posts;
  if(flag == "myself"){
    posts = await hello.posts();
  }else{
    posts = await hello.posts_by_id(flag);
  }
  if(num_posts == posts.length && flag == flag_last) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  let head = document.createElement("tr");
  let th_1 = document.createElement("th");
  th_1.setAttribute("style", "text-align: center");
  if(flag == "myself"){
    th_1.innerHTML = "My Post";
  }else{
    th_1.innerHTML = flag_name + "'s Post";
  }
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
  flag_last = flag;
}
var num_follows = 0;
async function load_follows(){
  let follows_section = document.getElementById("follows");
  follows = await hello.follows();
  if(num_follows == follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;
  let head = document.createElement("tr");
  let th_1 = document.createElement("th");
  th_1.setAttribute("style", "text-align: center");
  th_1.innerHTML = "Poster You Followed";
  head.appendChild(th_1);
  follows_section.appendChild(head);
  for(var i=0;i<follows.length;i++){
    let poster = document.createElement("tr");
    let td_1 = document.createElement("td");
    td_1.setAttribute("style", "text-align: center");
    let btn = document.createElement("button");
    btn.setAttribute("style", "text-align: center");
    btn.setAttribute("i",i);
    btn.innerHTML = follows[i].name;
    btn.onclick = () => {
      flag = follows[btn.getAttribute("i")].principal;
      flag_name = follows[btn.getAttribute("i")].name;
      load_posts();
    };
    td_1.appendChild(btn);
    poster.appendChild(td_1);
    follows_section.appendChild(poster);
  }
}

var num_all = 0;
async function load_all(){
  let posts_section = document.getElementById("all");
  let posts;
  posts = await hello.timeline();
  if(num_all == posts.length) return;
  posts_section.replaceChildren([]);
  num_all = posts.length;
  let head = document.createElement("tr");
  let th_1 = document.createElement("th");
  th_1.setAttribute("style", "text-align: center");
  th_1.innerHTML = "New Post";
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
  let home_btn = document.getElementById("home");
  home_btn.onclick = ()=>{
    flag = "myself";
    load_posts();
  };
  load_posts();
  load_all();
  load_follows();
  setInterval(load_all, 6000);
  setInterval(load_follows, 10000);
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