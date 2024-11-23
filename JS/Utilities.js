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
        time: child.time,
        replies: child.replies ? child.replies.map(reply => {

          return {
            author: reply.author,
            image: reply.image.src,
            message: reply.message,
            votes: reply.votes,
            timestamp: reply.timestamp,
            id: reply.Id,
            time: reply.time
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
    if (child.time) comment.time = child.time;
    comment.Id = child.id;
    comment.create();
    if (comment.time) comment.wrapper.querySelector(".timestamp").innerHTML = `${calculateTimeStamp(comment.time)}`
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
        // Reply.wrapper.setAttribute('data-Id', reply.id)
        Reply.reply = true;
        if (Reply.time) comment.wrapper.querySelector(".timestamp").innerHTML = `${calculateTimeStamp(Reply.time)}`
        Reply.parent = comment.wrapper;
        comment.replies.push(Reply);
      });
    }
  });

  sortObjects(App.comments)
  const inputDiv = new UserInput(App);
  inputDiv.create(document.querySelector('.input'));
}
/*export function loadState(func) {
  const savedState = JSON.parse(localStorage.getItem('one'));
  func(savedState)
}*/
//FUNCTION TO ORGANISE OBJECTS BASED ON THE NUMBER OF VOTES
function sortObjects(data) {
  const commentContainer = document.querySelector('.body')
  commentContainer.innerHTML = "";
  const sortedArr = data.sort((a, b) => b.votes - a.votes)

  sortedArr.forEach((comment) => {
    commentContainer.appendChild(comment.wrapper)
  })
}

//FUNCTION THAT ADDS DYNAMIC TIMESTAMPS
export function calculateTimeStamp(timestamp) {
  const oldTime = timestamp;
  let newTime = Math.floor((Date.now() - oldTime) / 1000);
  if (newTime < 20) {
    return `Just Now`;
  } else if (newTime < 60) {
    console.log(newTime)
    return `${newTime} seconds ago`;
  }
  let minutes = Math.floor(newTime / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  let hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  let days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} days ago`;
  }
  let weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }
}

function calculateTimeStamp2(oldTimestamp) {
  const currTime = Date.now();
  let diffInSeconds = Math.floor((currTime - oldTimestamp) / 1000); // Difference in seconds

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  let diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  let diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  let diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  let diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  }

  let diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }

  let diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} years ago`;
}