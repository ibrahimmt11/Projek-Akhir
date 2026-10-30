class BasePage {
  visit(path) {
    cy.visit(path);
  }

  group(label) {
    return cy.contains(".oxd-input-group", label);
  }

  selectOption(label, option) {
    this.group(label).find(".oxd-select-text").click();
    cy.contains(".oxd-select-dropdown .oxd-select-option", option).click();
  }

  selectFirstOption(label) {
    this.group(label).find(".oxd-select-text").click();
    return cy
      .get(".oxd-select-dropdown .oxd-select-option")
      .eq(1)
      .then(($opt) => {
        const text = $opt.text().trim();
        cy.wrap($opt).click();
        return cy.wrap(text);
      });
  }

  typeAutocomplete(label, typeText, pickText = typeText) {
    this.group(label).find("input").clear().type(typeText);
    cy.contains(
      ".oxd-autocomplete-dropdown .oxd-autocomplete-option",
      pickText,
    ).click();
  }

  clickButton(name) {
    cy.contains("button", name).click();
  }

  get errorMessages() {
    return cy.get(".oxd-input-field-error-message");
  }

  get toast() {
    return cy.get(".oxd-toast");
  }
}

module.exports = BasePage;
