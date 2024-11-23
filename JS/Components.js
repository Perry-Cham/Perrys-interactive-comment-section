import { saveState, calculateTimeStamp } from './Utilities.js';

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
    this.Id = document.querySelectorAll('.comment-wrapper').length + 1;
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
    this.image.alt = `User ${this.author}'s' profile picture`
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
    const deleteBtn = document.createElement("button")
    const deleteBtnImg = new Image();
    deleteBtnImg.src = "images/icon-delete.svg"
    deleteBtn.innerHTML = `
    ${deleteBtnImg.outerHTML}
    <p>Delete</p>
    `

    deleteBtn.classList.add("deleteBtn")
    deleteBtnImg.classList.add("delete")
    deleteBtn.addEventListener("click", (e) => this.handleDelete(e))



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
    this.wrapper.setAttribute("data-id", `${this.Id}`)
    deleteBtn.setAttribute("data-id", `${this.Id}`)

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
    saveState(this.App)
  }

  handleDelete(e) {
    let Id = e.target.getAttribute("data-id")
    if (!Id) {
      Id = e.target.parentNode.getAttribute("data-id")
    }


    if (this.App.currentUser == this.author) {
      const modal = new Modal("Delete Comment", "Are you sure you want to delete this comment? This will remove the comment and cannot be undone!", this, true, Id);
      modal.create();
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
    input.targetObj = this;
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
    const comments = document.querySelectorAll(".comment-wrapper");


    this.replies.push(reply)

    const input = new UserInput(this.App, true, false, this.wrapper);
    input.parObj = this;

    input.targetObj = reply;
    reply.comment.classList.add('hide')
    const yes = reply.body.querySelector('.one');
    yes.classList.add('hide')
    input.create(reply.body)

    reply.wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}


export class UserInput {
  constructor(App, reply = false, edit = false, parent = null,) {
    this.App = App;
    this.targetObj = null;
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
    /*if (!element.querySelector(".wrapper")) element.appendChild(this.body)*/
    if (!element.querySelector('.wrapper')) element.appendChild(this.body)
  }

  write() {
    const comments = document.querySelectorAll(".comment-wrapper")
    const text = this.input.value;
    const newComment = new Comments(this.App.UserImage, text, this.App.currentUser, 0, "A few Seconds Ago", null, this.App)
    newComment.Id = comments.length + 1;
    newComment.time = Date.now();
    this.App.comments.push(newComment)
    newComment.create();
    newComment.wrapper.querySelector(".timestamp").innerHTML =
      `${calculateTimeStamp(newComment.time)}`
    this.input.value = ""
    saveState(this.App)
  }
  edit() {
    const child = this.parent.querySelector(".message")
    child.innerHTML = this.input.value;
    child.classList.remove("hide")
    this.targetObj.message = this.input.value;


    const yes = this.parent.querySelectorAll(".one")
    yes.forEach((child) => {
      child.classList.remove("hide")
    })
    const inputField = this.parent.querySelector(".user-input")

    inputField.parentNode.removeChild(inputField)
    saveState(this.App)
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
    this.targetObj.time = Date.now();
    this.targetObj.message = this.input.value;
    this.targetObj.wrapper.querySelector(".timestamp").innerHTML =
      `${calculateTimeStamp(this.targetObj.time)}`
    inputField.parentNode.removeChild(inputField)
    saveState(this.App);
  }
}


/*Modal Class For delete Confirmation */
export class Modal {
  constructor(heading, message, parent = null, Delete = true, id = null, target = null) {
    //MODAL COMPONENTS
    this.wrapper = document.createElement("div")
    this.body = document.createElement("div")
    this.message = message;
    this.messageTag = document.createElement("p")
    this.heading = heading;
    this.headingTag = document.createElement("h2")
    this.confirmBtn = document.createElement("button");
    this.declineBtn = document.createElement("button");

    //DATA OR STATE
    this.delete = Delete;
    this.parObj = parent;
    this.Id = id;
    this.targetElement = target;

    //CLASSES AND COMPONENT LIST
    this.classes = ["modal-wrapper", "modal-body", "modal-heading", "modal-message", "confirmBtn", "declineBtn"]
  }
  addClass() {
    const components = [this.wrapper, this.body, this.headingTag, this.messageTag, this.confirmBtn, this.declineBtn]

    for (let i = 0; i < components.length; i++) {
      components[i].classList.add(this.classes[i])
    }

    this.declineBtn.classList.add("modal-Btn")
    this.confirmBtn.classList.add("modal-Btn")
  }
  create() {
    this.addClass();
    this.headingTag.innerHTML = this.heading;
    this.messageTag.innerHTML = this.message;

    if (this.delete) {
      this.declineBtn.innerHTML = "No, cancel";
      this.confirmBtn.innerHTML = "Yes, delete";

      //ADD EVENT LISTENERS
      this.declineBtn.addEventListener("click", () => this.cancel())
      this.confirmBtn.addEventListener("click", () => this.deleteMsg())
    } else {
      this.declineBtn.innerHTML = "No, cancel";
      this.confirmBtn.innerHTML = "Yes, edit";

      //ADD EVENT LISTENERS
      this.declineBtn.addEventListener("click", () => this.cancel())
      this.confirmBtn.addEventListener("click", () => this.editMsg())
    }


    const wrapper = document.createElement("div")
    wrapper.appendChild(this.declineBtn);
    wrapper.appendChild(this.confirmBtn);

    const bodyNodes = [this.headingTag, this.messageTag, wrapper]
    bodyNodes.forEach((child) => {

      this.body.appendChild(child)
    })
    this.wrapper.appendChild(this.body)
    document.body.appendChild(this.wrapper)
  }
  deleteMsg() {
    let element = this.parObj.App.comments.find(child => child.Id == this.Id)
    if (element) {
      let index = this.parObj.App.comments.indexOf(element)
      this.parObj.App.comments.splice(index, 1)


      element.body.parentNode.parentNode.removeChild(element.wrapper)
      saveState(this.parObj.App)
      this.Unmount()
    } else if (!element) {
      let index;
      for (let i = 0; i < this.parObj.App.comments.length; i++) {
        // Tab to edit
        let child = this.parObj.App.comments[i];
        let element2 = child.replies.find((reply) => reply.Id == this.Id)
        let elementIndex = child.replies.indexOf(element2);
        child.replies.splice(elementIndex, 1)

        if (element2)
          element2.wrapper.parentNode.removeChild(element2.wrapper)
        saveState(this.parObj.App)
      }
      this.Unmount();
    }
  }
  cancel() {
    this.Unmount()
  }
  Unmount() {
    document.body.removeChild(this.wrapper)
  }
}

