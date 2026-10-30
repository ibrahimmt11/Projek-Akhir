const BasePage = require("./BasePage");

class LoginPage extends BasePage {
  url = "/web/index.php/auth/login";

  get usernameInput() {
    return cy.get('input[name="username"]');
  }
  get passwordInput() {
    return cy.get('input[name="password"]');
  }
  get loginButton() {
    return cy.get('button[type="submit"]');
  }
  get alertMessage() {
    return cy.get(".oxd-alert-content-text");
  }
  get forgotLink() {
    return cy.get(".orangehrm-login-forgot-header");
  }
  get resetTitle() {
    return cy.get(".orangehrm-forgot-password-title");
  }
  get dashboardTitle() {
    return cy.get(".oxd-topbar-header-breadcrumb-module");
  }

  open() {
    this.visit(this.url);
    this.usernameInput.should("be.visible");
  }

  login(username, password) {
    if (username) this.usernameInput.type(username);
    if (password) this.passwordInput.type(password);
    this.loginButton.click();
  }

  openForgotPassword() {
    this.forgotLink.click();
  }
}

module.exports = new LoginPage();
