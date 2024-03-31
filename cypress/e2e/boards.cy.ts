import { dispatchAction } from '../support/utils';

describe('Boards list page', () => {
  before(() => {
    indexedDB.deleteDatabase('TaskManagerDB');
  });

  it('should load the boards from the db by default', () => {
    cy.visit('/');

    cy.get('.boards-list').should('be.visible');
    cy.get('.boards-list').should('have.length.at.least', 1);
    cy.get('.boards-list h3').first().should('contain.text', 'Default Board');
  });

  it('should display an error message if the boards fail to load', () => {
    cy.visit('/');

    dispatchAction({
      type: '[Boards List] Boards Load Failure',
      error: 'ERROR',
    }).then(() => {
      cy.get('.error-message')
        .should('be.visible')
        .should('contain.text', 'Something went wrong...');
    });
  });
});
