import { dispatchAction } from "../support/utils";

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

  it('should not display the boards if they fail to load', () => {
    cy.visit('/');

    cy.get('.board-list').should('be.visible');
    dispatchAction({
      type: '[Boards List] Boards Load Failure',
      error: 'ERROR',
    }).then(() => {
      cy.get('.error-message')
      .should('be.visible')
      .should('contain.text', 'Something went wrong...');
    });
  });

  it('should visit the board details', () => {
    cy.visit('/');

    cy.get('.board-list li a').first().click();
    cy.url().should('include', '/boards/');
  });

});
