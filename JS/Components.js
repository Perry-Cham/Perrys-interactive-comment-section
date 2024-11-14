export class Comments {
  constructor(image, message, author, score, timestamp, parent, app = null) {
    this.App = app;
    this.wrapper = document.createElement("div")
    this.body = document.createElement("article")
    this.topWrapper = document.createElement("div")
    this.replyBtn = document.createElement("div")
    this.voteDisplay = document.createElement("button")
    this.image = new Image();
    this.image.src = image;
    this.comment = document.createElement('p');
    this.message = message;
    this.author = author;
    this.votes = score;
    this.timestamp = timestamp;
    this.replies = [];
    this.reply = false;
    this.message = message;
    this.classes =
      ["comment-wrapper", "comment-body", "inner-wrapper", "vote-button", "message"
        , "author-img"]
    this.parent = parent;
    this.components = [this.wrapper, this.body, this.topWrapper,
    this.voteDisplay, this.comment, this.image];
  }
  addClass() {
    const components = [this.wrapper, this.body, this.topWrapper, this.voteDisplay, this.comment, this.image]

    for (let i = 0; i < components.length; i++) {
      components[i].classList.add(this.classes[i])
    }

  }

  create() {
    this.addClass();
    //EDIT THE HTML OF THE COMPONENTS

    //REPLY/EDIT BUTTON LOGIC
    this.replyBtn.innerHTML = `<img src="images/icon-reply.svg"> <p
    class="reply-p"></p>`

this.replyBtn.classList.add('reply-btn')
    const replyBtnText = this.replyBtn.querySelector(".reply-p")

    if (this.App.currentUser == this.author) {
      replyBtnText.innerHTML = "Edit"
      this.replyBtn.addEventListener("click", () => this.handleUpdate())
    }
    else {
      replyBtnText.innerHTML = "Reply";
      this.replyBtn.addEventListener("click", () => this.handleReply())
    }


    //TOP WRAPPER LOGIC
    this.topWrapper.innerHTML = `
    <div class="img-container">
    ${this.image.outerHTML}
    <p class=${"timestamp"}>${this.timestamp}</p>
  </div>
    `
//ACTUAL COMMENT TEXT
    this.comment.innerHTML = this.message;

    //VOTE DISPLAY LOGIC
    this.voteDisplay.addEventListener("click", (e) => this.handleScore(e))

    this.voteDisplay.innerHTML = `
    <img class="add" src=${"images/icon-plus.svg"}>
    <p class="votes">${this.votes}</p>
   <img class="subtract" src="images/icon-minus.svg">
    `

    //DELETE BUTTON LOGIC
    const deleteBtn = document.createElement("div")
    const deleteBtnImg = new Image();
    deleteBtnImg.src = "images/icon-delete.svg"
    deleteBtn.innerHTML = `
    ${deleteBtnImg.outerHTML}
    <p>Delete</p>
    `
    
    deleteBtn.classList.add("deleteBtn")
    deleteBtnImg.classList.add("delete")
    deleteBtn.addEventListener("click", (e) => this.handleDelete(e))
    deleteBtn.setAttribute("data-id", this.Id)


    //APPEND THE ELEMENTS TO THE BODY OF THE COMMENT
    const div = document.createElement("div")
    const div2 = document.createElement("div")


    div.appendChild(this.topWrapper)
    div.appendChild(this.comment)
    this.body.appendChild(div)
    this.body.appendChild(div2)

    div2.appendChild(this.voteDisplay)
   if (this.App.currentUser == this.author) {
      if (window.innerWidth < 700)
        div2.appendChild(deleteBtn)
      else this.topWrapper.appendChild(deleteBtn)
    }
    if (window.innerWidth < 500) div2.appendChild(this.replyBtn)
    else if (window.innerWidth > 500) this.topWrapper.appendChild(this.replyBtn)
    div.classList.add("two")
    div2.classList.add("one")

    this.wrapper.appendChild(this.body)
    this.wrapper.setAttribute("data-id", this.Id)

    if (!this.reply) {
      document.querySelector(".body").appendChild(this.wrapper)
    } else {
      this.parent.appendChild(this.wrapper)
      this.wrapper.classList.add("reply")
    }

  }

  mountReply() {
    this.create()
    this.wrapper.classList.add("reply")
    this.parent.appendChild(this.wrapper)
  }

  handleScore(e) {
    const votes = e.target.parentNode
      .querySelector(".votes")
    if (e.target.classList.contains("add")) {
      this.votes++;
      votes.innerHTML = this.votes;
    } else if (e.target.classList.contains("subtract")) {
      this.votes--;
      votes.innerHTML = this.votes
    }
  }

  handleDelete(e) {
    
    let Id = e.target.getAttribute("data-id")
    if(!Id){ Id = e.target.parentNode.getAttribute("data-id")
     console.log(e)
      console.log(e.target.tagName)
    }
    if (this.author === this.App.currentUser) {
      const elements = document.querySelectorAll(".comment-wrapper")
      const elements2 = Array.from(elements);
      const element = elements2.find((child) => child.getAttribute("data-id") ===
        Id)
      element.parentNode.removeChild(element)
      
      let comment = this.App.comments.find((child) => child.Id == Id)

      let index = this.App.comments.indexOf(comment)
      if (index === -1) {
        this.App.comments.forEach((child) => {
          comment = child.replies.find((child) => child.Id == Id)
          index = child.replies.indexOf(comment)
          
          if (index > -1) child.replies.splice(index, 1)
        })
      } else {
        this.App.comments.splice(index, 1)
      }
      
    }

  }

  handleUpdate() {
    this.comment.classList.add("hide")
    const yes = this.body.querySelectorAll(".one")
    yes.forEach((child) => {
      child.classList.add("hide")
    })
    const element = this.body.querySelector(".message")
    const input = new UserInput(this.App, false, true, this.body);
    input.create(this.body);
    input.input.value = element.innerHTML;
  }

  handleReply() {
    /*CREATE A NEW COMMENT, APPEND IT TO WRAPPER HIDE TO THE MESSAGE AND .ONE
    ELEMENT APPEND THE INPUT ELEMENT CREATE CUSTOM METHKD ON INPUT THAT HANDLES
    RESPLIES THEN DISMOUNT INPUT ELEMENT AND VOILA! COMMENTS*/
    const reply = new Comments(this.App.UserImage, 'Hey brother',
      this.App.currentUser, 0, 'A few seconds Ago', this.wrapper, this.App)
    reply.reply = true;
    reply.create();
    this.replies.unshift(reply)


    const input = new UserInput(this.App, true, false, this.wrapper);
    input.parObj = this;
    reply.comment.classList.add('hide')
    const yes = reply.body.querySelector('.one');
    yes.classList.add('hide')
    input.create(reply.body)
    
  }
}


export class UserInput {
  constructor(App, reply = false, edit = false, parent = null) {
    this.App = App;
    this.body = document.createElement("div")
    this.image = new Image();
    this.image.src = "images/avatars/image-juliusomo.png"
    this.input = document.createElement("textarea")
    this.submitBtn = document.createElement("button")
    this.classes = ["user-input", "user-img", "comment-input", "send-btn"]
    this.reply = reply;
    this.Edit = edit;
    this.parent = parent;
  }
  addClass() {
    const components = [this.body, this.image, this.input, this.submitBtn]

    for (let i = 0; i < components.length; i++) {
      components[i].classList.add(this.classes[i])
    }

    this.image.classList.add("author-img")

  }
  create(element) {
    this.addClass();

    //THIS CODE CHANGES THE TEXT OF THE BUTTON ELEMENT DEPENDING ON WHETHER ITS A NEW COMMENT OR AN EDIT
    this.input.setAttribute("placeholder", "Add a comment")
    if (this.Edit) this.submitBtn.innerHTML = "Update"
    else if (!this.reply) this.submitBtn.innerHTML = "Comment";
    else if (this.reply) this.submitBtn.innerHTML = " Reply"

    const wrapper = document.createElement("div")


    wrapper.classList.add("wrapper")
    if (window.innerWidth < 500) {
      wrapper.appendChild(this.image);
    }
    else this.body.appendChild(this.image);
    wrapper.appendChild(this.submitBtn)


    //CHANGES THE FUNCTION OF THE SUBMIT BUTTON BASED ON THE EDIT PROPERTY
    if (!this.Edit) {
      if (!this.reply) {
        this.submitBtn.addEventListener("click", () => {
          this.write();
        })
      } else {
        this.submitBtn.addEventListener("click", () => this.Reply())
      }

    } else if (this.Edit) {
      this.submitBtn.addEventListener("click", () => {
        this.edit();
      })
    }


    //APPEND ELEMENTS TO THE DOM
    this.body.appendChild(this.input)
    this.body.appendChild(wrapper)
    if (!element.querySelector(".wrapper")) element.appendChild(this.body)
  }

  write() {
    const comments = document.querySelectorAll(".comment-wrapper")
    const text = this.input.value;
    const newComment = new Comments(this.App.UserImage, text, this.App.currentUser, 0, "A few Seconds Ago", null, this.App)
    newComment.Id = comments.length + 1;
    this.App.comments.push(newComment)
    newComment.create();
    this.input.value = ""
    
  }
  edit() {
    const child = this.parent.querySelector(".message")
    child.innerHTML = this.input.value;
    child.classList.remove("hide")


    const yes = this.parent.querySelectorAll(".one")
    yes.forEach((child) => {
      child.classList.remove("hide")
    })
    const inputField = this.parent.querySelector(".user-input")
    
    inputField.parentNode.removeChild(inputField)
  }

  Reply(element) {

    const yes = this.parent.querySelectorAll(".one")
    yes.forEach((child) => {
      child.classList.remove("hide")
    })


    const inputField = this.parent.querySelector(".user-input")
    const child = inputField.parentNode.querySelector(".message")

    child.classList.remove("hide")
    child.innerHTML = this.input.value;
    this.parObj.replies[0].message = this.input.value;
    inputField.parentNode.removeChild(inputField)
    const arr = []
    const html = this.parObj.replies.forEach((child) => arr.push(child.wrapper))
    
  }
}
