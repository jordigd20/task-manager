describe('Change the theme mode', () => {
  it('should switch from the preferred color scheme to the another theme', () => {
    cy.visit('/');

    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const colorToSwitch = isDarkMode ? 'light' : 'dark';
    const currentColor = isDarkMode ? 'dark' : 'light';

    if (colorToSwitch === 'dark') {
      cy.get('html').should('not.have.class');
      cy.get(`.theme-buttons[data-mode="${colorToSwitch}"]`).click();
      cy.get('html').should('have.class', currentColor);

      return;
    }

    cy.get('html').should('have.class', currentColor);
    cy.get(`.theme-buttons[data-mode="${colorToSwitch}"]`).click();
    cy.get('html').should('not.have.class');
  });

  it('should switch to the theme from the localStorage', () => {
    cy.visit('/');

    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const colorToSwitch = isDarkMode ? 'light' : 'dark';
    const currentColor = isDarkMode ? 'dark' : 'light';

    localStorage.setItem('theme', colorToSwitch);
    cy.reload();

    if (colorToSwitch === 'dark') {
      cy.get('html').should('have.class', currentColor);

      return;
    }

    cy.get('html').should('not.have.class');
  });
});
