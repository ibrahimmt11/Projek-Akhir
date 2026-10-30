const RecruitmentPage = require("../support/pages/RecruitmentPage");

describe("Recruitment - OrangeHRM", () => {
  const uniqueSuffix = Date.now();

  beforeEach(function () {
    cy.fixture("recruitmentData").as("data");
    cy.loginAsAdmin();
  });

  it("TC_R_001 - Menampilkan halaman Candidates List", function () {
    RecruitmentPage.openCandidates();
    cy.url().should("include", "/recruitment/viewCandidates");
    RecruitmentPage.breadcrumb.should("contain", "Recruitment");
    RecruitmentPage.pageTitle.should("contain", "Candidates");
  });

  it("TC_R_002 - Menambahkan kandidat baru", function () {
    const candidate = {
      ...this.data.candidate,
      lastName: `${this.data.candidate.lastName}${uniqueSuffix}`,
    };
    RecruitmentPage.openCandidates();
    RecruitmentPage.clickAdd();
    RecruitmentPage.fillCandidate(candidate);
    RecruitmentPage.save();
    cy.url().should("include", "/recruitment/addCandidate/");
    cy.contains("Application Stage").should("be.visible");
  });

  it("TC_R_003 - Tambah kandidat tanpa field wajib", function () {
    RecruitmentPage.openCandidates();
    RecruitmentPage.clickAdd();
    RecruitmentPage.save();
    RecruitmentPage.errorMessages
      .should("have.length", 3)
      .each(($el) => expect($el).to.contain(this.data.message.required));
  });

  it("TC_R_004 - Tambah kandidat dengan format email tidak valid", function () {
    const { firstName, lastName, invalidEmail } = this.data.candidate;
    RecruitmentPage.openCandidates();
    RecruitmentPage.clickAdd();
    RecruitmentPage.fillCandidate({ firstName, lastName, email: invalidEmail });
    RecruitmentPage.save();
    RecruitmentPage.errorMessages.should(
      "contain",
      this.data.message.invalidEmail,
    );
  });

  it("TC_R_005 - Cari kandidat berdasarkan Vacancy", function () {
    RecruitmentPage.openCandidates();
    RecruitmentPage.selectFirstOption("Vacancy").then((vacancy) => {
      RecruitmentPage.searchCandidates();
      RecruitmentPage.shouldListOnlyVacancy(vacancy);
    });
  });

  it("TC_R_006 - Cari kandidat berdasarkan Candidate Name", function () {
    const { firstName, middleName, lastName } = this.data.candidate;
    const fullLastName = `${lastName}${uniqueSuffix}`;
    RecruitmentPage.openCandidates();
    RecruitmentPage.typeAutocomplete("Candidate Name", firstName, fullLastName);
    RecruitmentPage.searchCandidates();
    RecruitmentPage.tableRows
      .should("have.length.greaterThan", 0)
      .first()
      .should("contain", firstName)
      .and("contain", fullLastName);
  });

  it("TC_R_007 - Menampilkan tab Vacancies", function () {
    RecruitmentPage.openCandidates();
    cy.contains(".oxd-topbar-body-nav-tab", "Vacancies").click();
    cy.url().should("include", "/recruitment/viewJobVacancy");
    RecruitmentPage.pageTitle.should("contain", "Vacancies");
  });

  it("TC_R_008 - Tambah Vacancy tanpa field wajib", function () {
    RecruitmentPage.openVacancies();
    RecruitmentPage.clickAdd();
    RecruitmentPage.save();
    RecruitmentPage.errorMessages
      .should("have.length", 3)
      .each(($el) => expect($el).to.contain(this.data.message.required));
    cy.url().should("include", "/recruitment/addJobVacancy");
  });
});
