import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="reset-form"
export default class extends Controller {
  static targets = ["input"];
  connect() {}

  clearInput() {
    console.log("resetting form");
    this.inputTarget.value = "";
  }
}
