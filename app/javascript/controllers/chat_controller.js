import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="chat"
export default class extends Controller {
  static values = { currentUserId: String };

  // Set up observers when the controller connects
  connect() {
    this.setupScrollListener();
    this.setupMessageListener();
  }

  // Disconnect observers when the controller disconnects
  disconnect() {
    this.scrollObserver.disconnect();
    this.messageObserver.disconnect();
  }

  // Set up an observer to scroll the chatbox to the bottom
  setupScrollListener() {
    this.scrollToBottom();

    this.scrollObserver = new MutationObserver(() => {
      this.scrollToBottom();
    });

    this.scrollObserver.observe(this.element, {
      childList: true,
      subtree: true,
    });
  }

  // Set up an observer to style messages
  setupMessageListener() {
    this.styleExistingMessages();

    this.messageObserver = new MutationObserver((mutations) => {
      this.styleAddedNodes(mutations);
    });

    this.messageObserver.observe(this.element, {
      childList: true,
      subtree: true,
    });
  }

  // Scroll to the bottom of the chatbox
  scrollToBottom() {
    this.element.scrollTop = this.element.scrollHeight;
  }

  // Style existing messages
  styleExistingMessages() {
    this.element.querySelectorAll(".message").forEach((message) => {
      this.styleMessage(message);
    });
  }

  // Style nodes added to the chatbox
  styleAddedNodes(mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Nodetype of 1 is an element. EG: <div>, <p>, <span>, <a> etc.
        if (node.nodeType === 1) {
          this.styleMessage(node);
        }
      });
    });
  }

  // Style a message node
  styleMessage(node) {
    let messageNode = this.getMessageNode(node);
    if (!messageNode) return;

    const userId = messageNode.dataset.userId;
    const messageBody = messageNode.querySelector(".message__body");

    this.applyStyle(userId, messageBody);
  }

  // Get the message node from a node
  getMessageNode(node) {
    return node.closest(".message") || node.querySelector(".message");
  }

  // Apply style to a message body
  applyStyle(userId, messageBody) {
    if (userId === this.currentUserIdValue) {
      messageBody.classList.add("bg-themeColorMain", "text-textColorSecondary");
    } else {
      messageBody.classList.add(
        "border",
        "border-themeColorMain",
        "text-textColorMain"
      );
    }
  }
}
