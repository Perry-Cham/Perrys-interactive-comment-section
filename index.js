import { Comments, UserInput } from './JS/Components.js'

let Data;
let date = new Date();

const body = document.querySelector(".body");
const inputS = document.querySelector(".input");
const App = {
  comments: [],
  Data: []
}

fetch('http://localhost:8000/data.json').then(response =>
  response.json()).then((data) => {
    Data = data;
    setUp();
  })
/*function setUp() {
  App.currentUser = Data.currentUser.username;
  App.UserImage = Data.currentUser.image.png;
  App.Data = [...Data.comments]
  App.comments = []


  App.Data.forEach((child) => {
    const comment = new Comments(child.user.image.png, child.content,
      child.user.username, child.score, child.createdAt, null, App)
    comment.Id = child.id;
    comment.create();
    App.comments.push(comment)




    if (child.replies.length > 0) {
      child.replies.forEach((reply) => {
        const Reply = new Comments(reply.user.image.png,
          reply.content, reply.user.username, reply.score, reply.createdAt,
          child.image)
        Reply.Id = reply.id;

        App.comments.forEach((comment) => {
          Comment.replies = comment.replies.push(Reply)
          comment.replies.forEach((reply2) => {
            reply2.App = App
            reply2.reply = true
            reply2.parent = comment.wrapper;
            reply2.mountReply();
          })
        })

      })
    }
  })
  const inputDiv = new UserInput(App);
  inputDiv.create(inputS)




}*/
function setUp() {
  App.currentUser = Data.currentUser.username;
  App.UserImage = Data.currentUser.image.png;
  App.Data = [...Data.comments];
  App.comments = [];

  // Loop through each comment in App.Data
  App.Data.forEach((child) => {
    // Create the main comment
    const comment = new Comments(
      child.user.image.png,
      child.content,
      child.user.username,
      child.score,
      child.createdAt,
      null,
      App
    );
    comment.Id = child.id;
    comment.create();
    App.comments.push(comment);


    if (child.replies.length > 0) {
      child.replies.forEach((reply) => {

        const Reply = new Comments(
          reply.user.image.png,
          reply.content,
          reply.user.username,
          reply.score,
          reply.createdAt,
          comment.wrapper,
          App
        );
        Reply.Id = reply.id;
        Reply.reply = true;
        Reply.parent = comment.wrapper;
        Reply.mountReply();


        comment.replies.push(Reply);
      });
    }
  });

  const inputDiv = new UserInput(App);
  inputDiv.create(inputS);
}
function main() {

}