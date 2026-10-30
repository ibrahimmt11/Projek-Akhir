const LoginPage = require("./pages/LoginPage");

Cypress.Commands.add("loginAsAdmin", () => {
  cy.fixture("loginData").then(({ valid }) => {
    cy.session("admin", () => {
      LoginPage.open();
      LoginPage.login(valid.username, valid.password);
      cy.url().should("include", "/dashboard");
    });
  });
});
