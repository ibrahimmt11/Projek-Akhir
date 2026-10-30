const BasePage = require("./BasePage");

const LIST_API = /\/api\/v2\/directory\/employees\?limit=/;

class DirectoryPage extends BasePage {
  url = "/web/index.php/directory/viewDirectory";

  get pageTitle() {
    return cy.get(".oxd-topbar-header-breadcrumb-module");
  }
  get searchForm() {
    return cy.get(".oxd-table-filter");
  }
  get cards() {
    return cy.get(".orangehrm-directory-card");
  }
  get recordCount() {
    return cy.get(".orangehrm-horizontal-padding .oxd-text--span");
  }
  get autocompleteDropdown() {
    return cy.get(".oxd-autocomplete-dropdown");
  }

  shouldShowCard(fullName, jobTitle) {
    const namePattern = new RegExp(fullName.trim().split(/\s+/).join("\\s+"));
    this.cards.should("have.length", 1);
    this.cards.first().invoke("text").should("match", namePattern);
    this.cards.first().should("contain", jobTitle);
  }

  open() {
    cy.intercept("GET", LIST_API).as("loadList");
    this.visit(this.url);
    cy.wait("@loadList");
  }

  searchByName(typeText, pickText) {
    this.typeAutocomplete("Employee Name", typeText, pickText);
  }

  typeEmployeeName(text) {
    this.group("Employee Name").find("input").clear().type(text);
  }

  selectJobTitle(title) {
    this.selectOption("Job Title", title);
  }
  selectLocation(loc) {
    this.selectOption("Location", loc);
  }

  search() {
    this.clickButton("Search");
    cy.wait("@loadList");
  }

  reset() {
    this.clickButton("Reset");
    cy.wait("@loadList");
  }
}

module.exports = new DirectoryPage();
