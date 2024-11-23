import { Comments, UserInput, Modal } from './JS/Components.js'
import { saveState, loadState } from './JS/Utilities.js'

let Data;
let date = new Date();
//Old state is not parsed here. This only serves to confirm whether the object exists or not in the load state function
let oldState = localStorage.getItem('one');
const body = document.querySelector(".body");
const inputSection = document.querySelector(".input");

const App = {
  comments: [],
  Data: []
}


fetch('http://localhost:7700/data.json').then(response =>
  response.json()).then((data) => {
    Data = data;
    oldState ? loadState(App, Comments, UserInput) : setUp(Data);
  })

function setUp(value) {
  App.currentUser = value.currentUser.username;
  App.UserImage = value.currentUser.image.png;
  App.Data = [...value.comments];
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
      child.replies.forEach((reply, index) => {

        const Reply = new Comments(
          reply.user.image.png,
          reply.content,
          reply.user.username,
          reply.score,
          reply.createdAt,
          comment.wrapper,
          App
        );
        Reply.parObj = comment.replies;
        // Reply.Id = reply.Id;
        Reply.reply = true;
        Reply.parent = comment.wrapper;
        Reply.mountReply();
        comment.replies.push(Reply);
      });
    }
  });


  const inputDiv = new UserInput(App);
  inputDiv.create(inputSection);
}



