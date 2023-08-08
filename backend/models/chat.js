const uuidv4 = require("uuid").v4;

const messages = new Set();
const users = new Map();

const defaultMessages = {
  999:
    "Oops .. it looks like you entered an incorrect number.\n" +
    "For the main menu, press 0\n",
  0:
    "1. For help adding a new recipe\n" +
    "2.For help editing a new recipe\n" +
    "3. For technical support\n",
  1:
    "Click the 'New Recipe' button in the nav bar, fill in the recipe details and finally click the 'Publish' button.\n" +
    "For the main menu, press 0\n",
  2:
    "Navigate to the recipe you want to edit.\n" +
    "Click the 'Edit Recipe' button in the body of the recipe, edit the recipe details and finally click the 'Save' button.\n" +
    "For the main menu, press 0\n",
  3:
    "Contact us by email: Recipe4U@cs.colman.ac.il\n" +
    "For the main menu, press 0\n",
};

const SystemDefaultUser = {
  id: uuidv4(),
  name: "Recipe4U",
};

const messageExpirationTimeMS = 5 * 60 * 1000;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on("getMessages", () => this.getMessages());
    socket.on("message", (value) => this.handleMessage(value));
    socket.on("disconnect", () => this.disconnect());
    socket.on("addUser", (user) => this.addUser(user));
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }
  async addUser(user) {
    await new Promise((resolve) => resolve(users.set(this.socket, user))).then(
      () => this.handleMessage(defaultMessages[0], true, true)
    );
  }
  sendMessage(message) {
    if (message.user.id === users.get(this.socket).id) {
      this.socket.emit("message", message);
      defaultMessages[message.value]
        ? this.handleMessage(defaultMessages[message.value], true)
        : this.handleMessage(defaultMessages[999], true);
    } else if (
      message.user.id === SystemDefaultUser.id &&
      message.to.id === users.get(this.socket).id
    ) {
      this.socket.emit("message", message);
    }
  }
  sendHistoryMessage(message) {
    if (message.user.id === users.get(this.socket).id) {
      this.socket.emit("message", message);
    } else if (
      message.user.id === SystemDefaultUser.id &&
      message.to.id === users.get(this.socket).id
    ) {
      this.socket.emit("message", message);
    }
  }
  getMessages() {
    messages.forEach((message) => this.sendHistoryMessage(message));
  }

  handleMessage(value, systemMessage, helloMessage) {
    var user = null;
    var toUser = null;
    if (systemMessage) {
      user = SystemDefaultUser;
      toUser = users.get(this.socket) || defaultUser;
    } else {
      user = users.get(this.socket) || defaultUser;
      toUser = SystemDefaultUser;
    }

    const message = {
      id: helloMessage ? user.id : uuidv4(),
      user: user,
      to: toUser,
      value,
      time: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);

    setTimeout(() => {
      messages.delete(message);
      this.io.sockets.emit("deleteMessage", message.id);
    }, messageExpirationTimeMS);
  }

  disconnect() {
    users.delete(this.socket);
  }
}

function chat(io) {
  io.on("connection", (socket) => {
    new Connection(io, socket);
  });
}

module.exports = chat;
