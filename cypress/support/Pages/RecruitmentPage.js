const BasePage = require("./BasePage");

const CANDIDATES_API = /\/api\/v2\/recruitment\/candidates\?limit=/;
const VACANCIES_API = /\/api\/v2\/recruitment\/vacancies\?limit=/;

class RecruitmentPage extends BasePage {
  candidatesUrl = "/web/index.php/recruitment/viewCandidates";
  vacanciesUrl = "/web/index.php/recruitment/viewJobVacancy";

  get firstNameInput() {
    return cy.get('input[name="firstName"]');
  }
  get middleNameInput() {
    return cy.get('input[name="middleName"]');
  }
  get lastNameInput() {
    return cy.get('input[name="lastName"]');
  }
  get emailInput() {
    return this.group("Email").find("input");
  }
  get saveButton() {
    return cy.get('button[type="submit"]');
  }
  get tableRows() {
    return cy.get(".oxd-table-body .oxd-table-card");
  }
  get pageTitle() {
    return cy.get(".oxd-table-filter-header-title");
  }
  get breadcrumb() {
    return cy.get(".oxd-topbar-header-breadcrumb-module");
  }

  openCandidates() {
    cy.intercept("GET", CANDIDATES_API).as("getCandidates");
    this.visit(this.candidatesUrl);
    cy.wait("@getCandidates");
  }

  openVacancies() {
    cy.intercept("GET", VACANCIES_API).as("getVacancies");
    this.visit(this.vacanciesUrl);
    cy.wait("@getVacancies");
  }

  clickAdd() {
    this.clickButton("Add");
  }

  fillCandidate({ firstName, middleName, lastName, email }) {
    if (firstName) this.firstNameInput.type(firstName);
    if (middleName) this.middleNameInput.type(middleName);
    if (lastName) this.lastNameInput.type(lastName);
    if (email) this.emailInput.type(email);
  }

  save() {
    this.saveButton.click();
  }

  searchCandidates() {
    this.clickButton("Search");
    cy.wait("@getCandidates");
  }

  shouldListOnlyVacancy(vacancy) {
    cy.get(".orangehrm-container").then(($container) => {
      if ($container.find(".oxd-table-body .oxd-table-card").length) {
        this.tableRows.each(($row) => expect($row).to.contain(vacancy));
      } else {
        cy.log(`Tidak ada kandidat untuk vacancy: ${vacancy}`);
      }
    });
  }
}

module.exports = new RecruitmentPage();
