//Functions For saving and loading state

export function saveState(MainObj) {
  const AppState = {
    currentUser: MainObj.currentUser,
    UserImage: MainObj.UserImage,
    comments: MainObj.comments.map((child) => {
      return {
        author: child.author,
        image: child.image.src,
        message: child.message,
        votes: child.votes,
        timestamp: child.timestamp,
        id: child.Id,
        replies: child.replies ? child.replies.map(reply => {
          return {
            author: reply.author,
            image: reply.image,
            message: reply.message,
            votes: reply.votes,
            timestamp: reply.timestamp,
            id: reply.Id
          }
        }) : []
      }
    })
  }
  localStorage.setItem('one', JSON.stringify(AppState))
}

export function loadState(App, Comments, UserInput) {
  const savedState = JSON.parse(localStorage.getItem('one'));

  App.currentUser = savedState.currentUser;
  App.UserImage = savedState.UserImage;
  App.Data = [...savedState.comments];
  App.comments = [];


  App.Data.forEach((child) => {
    // Create the main comment
    const comment = new Comments(
      child.image,
      child.message,
      child.author,
      child.votes,
      child.timestamp,
      null,
      App
    );
    comment.create();
    comment.Id = child.id;
    App.comments.push(comment);


    if (child.replies.length > 0) {
      child.replies.forEach((reply, index) => {

        const Reply = new Comments(
          reply.image,
          reply.message,
          reply.author,
          reply.votes,
          reply.timestamp,
          comment.wrapper,
          App
        );
        Reply.parObj = comment.replies;
        Reply.Id = reply.id;
        Reply.mountReply();
        Reply.wrapper.setAttribute('data-Id', reply.id)
        Reply.reply = true;
        Reply.parent = comment.wrapper;
        comment.replies.push(Reply);
      });
    }
  });


  const inputDiv = new UserInput(App);
  inputDiv.create(document.querySelector('.input'));
}
/*export function loadState(func) {
  const savedState = JSON.parse(localStorage.getItem('one'));
  func(savedState)
}*/