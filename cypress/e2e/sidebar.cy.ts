describe('Sidebar', () => {
  before(() => {
    indexedDB.deleteDatabase('TaskManagerDB');
  });

  it('should render the boards', () => {
    cy.visit('/');
    cy.get('.board-list').should('be.visible');
    cy.get('.board-list li').should('have.length.at.least', 1);
    cy.get('.board-list li').first().should('contain.text', 'Default Board');
  });

  it('should visit the board details', () => {
    cy.visit('/');

    cy.get('.board-list li a').first().click();
    cy.url().should('include', '/boards/');
  });

  //TODO: Should open the add new board dialog
});
