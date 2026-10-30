const DirectoryPage = require("../support/pages/DirectoryPage");

describe("Directory - OrangeHRM", () => {
  beforeEach(function () {
    cy.fixture("directoryData").as("data");
    cy.loginAsAdmin();
    DirectoryPage.open();
  });

  it("TC_D_001 - Menampilkan halaman Directory", function () {
    cy.url().should("include", "/directory/viewDirectory");
    DirectoryPage.pageTitle.should("contain", "Directory");
    DirectoryPage.searchForm.should("be.visible");
    DirectoryPage.cards.should("have.length.greaterThan", 0);
  });

  it("TC_D_002 - Cari karyawan berdasarkan nama valid", function () {
    DirectoryPage.searchByName(this.data.searchKeyword, this.data.employeeName);
    DirectoryPage.search();
    DirectoryPage.cards.should("have.length.greaterThan", 0);
    DirectoryPage.cards.first().should("contain", this.data.searchKeyword);
  });

  it("TC_D_003 - Cari karyawan berdasarkan Job Title", function () {
    DirectoryPage.selectJobTitle(this.data.jobTitle);
    DirectoryPage.search();
    DirectoryPage.cards.should("have.length.greaterThan", 0);
    DirectoryPage.cards.each(($card) =>
      expect($card).to.contain(this.data.jobTitle),
    );
  });

  it("TC_D_004 - Cari karyawan berdasarkan Location", function () {
    DirectoryPage.selectLocation(this.data.location);
    DirectoryPage.search();
    DirectoryPage.recordCount.should("contain", "Record");
    DirectoryPage.cards.should("have.length.greaterThan", 0);
  });

  it("TC_D_005 - Cari karyawan dengan kombinasi Name dan Job Title", function () {
    DirectoryPage.searchByName(this.data.searchKeyword, this.data.employeeName);
    DirectoryPage.selectJobTitle(this.data.jobTitle);
    DirectoryPage.search();
    DirectoryPage.shouldShowCard(this.data.employeeName, this.data.jobTitle);
  });

  it("TC_D_006 - Cari karyawan dengan nama tidak terdaftar", function () {
    DirectoryPage.typeEmployeeName(this.data.unknownName);
    DirectoryPage.autocompleteDropdown
      .should("be.visible")
      .and("contain", this.data.message.noRecords);
  });

  it("TC_D_007 - Reset filter pencarian Directory", function () {
    DirectoryPage.selectJobTitle(this.data.jobTitle);
    DirectoryPage.search();
    DirectoryPage.reset();
    DirectoryPage.group("Job Title")
      .find(".oxd-select-text-input")
      .should("contain", "-- Select --");
    DirectoryPage.group("Location")
      .find(".oxd-select-text-input")
      .should("contain", "-- Select --");
    DirectoryPage.group("Employee Name").find("input").should("have.value", "");
  });

  it("TC_D_008 - Kartu karyawan menampilkan informasi detail", function () {
    DirectoryPage.searchByName(this.data.searchKeyword, this.data.employeeName);
    DirectoryPage.search();
    DirectoryPage.shouldShowCard(this.data.employeeName, this.data.jobTitle);
    DirectoryPage.cards.first().find("img").should("exist");
  });
});
