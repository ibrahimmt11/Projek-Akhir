const LoginPage = require("../support/pages/LoginPage");

describe("Login - OrangeHRM", () => {
  beforeEach(function () {
    cy.fixture("loginData").as("data");
    LoginPage.open();
  });

  it("TC_L_001 - Login dengan kredensial valid", function () {
    const { username, password } = this.data.valid;
    LoginPage.login(username, password);
    cy.url().should("include", "/dashboard");
    LoginPage.dashboardTitle.should("contain", "Dashboard");
  });

  it("TC_L_002 - Login dengan username dan password kosong", function () {
    LoginPage.login();
    LoginPage.errorMessages
      .should("have.length", 2)
      .each(($el) => expect($el).to.contain(this.data.message.required));
  });

  it("TC_L_003 - Login dengan username kosong", function () {
    LoginPage.login("", this.data.valid.password);
    LoginPage.errorMessages
      .should("have.length", 1)
      .and("contain", this.data.message.required);
  });

  it("TC_L_004 - Login dengan password kosong", function () {
    LoginPage.login(this.data.valid.username, "");
    LoginPage.errorMessages
      .should("have.length", 1)
      .and("contain", this.data.message.required);
  });

  it("TC_L_005 - Login dengan password salah", function () {
    const { username, password } = this.data.wrongPassword;
    LoginPage.login(username, password);
    LoginPage.alertMessage.should("contain", this.data.message.invalid);
    cy.url().should("include", "/auth/login");
  });

  it("TC_L_006 - Login dengan username tidak terdaftar", function () {
    const { username, password } = this.data.unknownUser;
    LoginPage.login(username, password);
    LoginPage.alertMessage.should("contain", this.data.message.invalid);
    cy.url().should("include", "/auth/login");
  });

  it("TC_L_007 - Input password tersembunyi (masked)", function () {
    LoginPage.passwordInput
      .type(this.data.valid.password)
      .should("have.attr", "type", "password");
  });

  it("TC_L_008 - Navigasi ke Forgot Password lalu Cancel", function () {
    LoginPage.openForgotPassword();
    cy.url().should("include", "/requestPasswordResetCode");
    LoginPage.resetTitle.should("contain", "Reset Password");
    LoginPage.clickButton("Cancel");
    cy.url().should("include", "/auth/login");
  });
});
