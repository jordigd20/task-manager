import { dispatchAction } from '../support/utils';

describe('Boards list page', () => {
  before(() => {
    indexedDB.deleteDatabase('TaskManagerDB');
  });

  describe('Load boards', () => {
    it('should load the boards from the db by default', () => {
      cy.visit('/');

      cy.get('.boards-list').should('be.visible');
      cy.get('.boards-list').should('have.length.at.least', 1);
      cy.get('.boards-list h3').first().should('contain.text', 'Default Board');
    });

    it('should display an error message if the boards fail to load', () => {
      cy.visit('/');

      cy.get('.boards-list').should('be.visible');
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

  describe('Add board form', () => {
    it('should display add board form when clicking on the add new board button', () => {
      cy.visit('/');

      cy.get('[data-testid="add-board-button"]').click();
      cy.get('[data-testid="board-form"]').should('be.visible');
      cy.get('[data-testid="board-form"] h2').should(
        'contain.text',
        'New board'
      );
    });

    it('should close the add board form when clicking on the close button', () => {
      cy.visit('/');

      cy.get('[data-testid="add-board-button"]').click();
      cy.get('[data-testid="close-dialog-button"]').click();
      cy.get('[data-testid="board-form"]').should('not.exist');
    });

    it('should show an error message if the form is submitted with an empty board name', () => {
      cy.visit('/');

      cy.get('[data-testid="add-board-button"]').click();
      cy.get('[data-testid="board-form"]').should('be.visible');

      cy.get('[data-testid="board-form"] input[type="text"]').should(
        'be.empty'
      );
      cy.get('[data-testid="board-form"] button[type="submit"]').click();
      cy.get('[data-testid="invalid-board-name"]')
        .should('be.visible')
        .and(
          'contain.text',
          'Name is required and must be at least 3 characters long.'
        );
      cy.get('[data-testid="close-dialog-button"]').click();
    });

    it('should create a new board when the form is submitted with a valid board name', () => {
      cy.visit('/');

      cy.get('[data-testid="add-board-button"]').click();
      cy.get('[data-testid="board-form"]').should('be.visible');

      cy.get('[data-testid="board-form"] input[type="text"]').type(
        'Test new board'
      );
      cy.get('[data-testid="board-form"] input[type="radio"]')
        .last()
        .check({ force: true }); // Books icon
      cy.get('[data-testid="board-form"] button[type="submit"]').click();

      cy.get('[data-testid="board-form"]').should('not.exist');
      cy.get('.boards-list h3').last().should('contain.text', 'Test new board');
      cy.get('.boards-list img')
        .last()
        .should('have.attr', 'alt', 'books icon');
    });
  });

  describe('Edit board form', () => {
    it('should display edit board form when clicking on the edit board button', () => {
      cy.visit('/');

      cy.get('[data-testid="edit-board-button"]').first().click();
      cy.get('[data-testid="board-form"]').should('be.visible');
      cy.get('[data-testid="board-form"] h2').should(
        'contain.text',
        'Edit board'
      );
    });

    it('should load the board data into the form fields', () => {
      cy.visit('/');

      cy.get('[data-testid="edit-board-button"]').first().click();
      cy.get('[data-testid="board-form"]').should('be.visible');

      cy.get('[data-testid="board-form"] input[type="text"]').should(
        'have.value',
        'Default Board'
      );
      cy.get('[data-testid="board-form"] input[type="radio"]')
        .first()
        .should('be.checked');
    });

    it('should update the board when the form is submitted with a valid board name', () => {
      cy.visit('/');

      cy.get('[data-testid="edit-board-button"]').first().click();
      cy.get('[data-testid="board-form"]').should('be.visible');

      cy.get('[data-testid="board-form"] input[type="text"]')
        .clear()
        .type('Updated board');
      cy.get('[data-testid="board-form"] input[type="radio"]')
        .last()
        .check({ force: true }); // Books icon
      cy.get('[data-testid="board-form"] button[type="submit"]').click();

      cy.get('[data-testid="board-form"]').should('not.exist');
      cy.get('.boards-list h3').first().should('contain.text', 'Updated board');
      cy.get('.boards-list img')
        .first()
        .should('have.attr', 'alt', 'books icon');
    });

    it('should show an error message if the form is submitted with an empty board name', () => {
      cy.visit('/');

      cy.get('[data-testid="edit-board-button"]').first().click();
      cy.get('[data-testid="board-form"]').should('be.visible');

      cy.get('[data-testid="board-form"] input[type="text"]').clear();
      cy.get('[data-testid="board-form"] button[type="submit"]').click();
      cy.get('[data-testid="invalid-board-name"]')
        .should('be.visible')
        .and(
          'contain.text',
          'Name is required and must be at least 3 characters long.'
        );
    });
  });

  describe('Delete board', () => {
    it('should display a confirmation modal when clicking on the delete board button', () => {
      cy.visit('/');

      cy.get('[data-testid="delete-board-button"]').first().click();
      cy.get('[data-testid="confirmation-modal"]').should('be.visible');
      cy.get('[data-testid="confirmation-modal"] h2').should(
        'contain.text',
        'Delete board'
      );
    });

    it('should close the confirmation modal when clicking on the close button', () => {
      cy.visit('/');

      cy.get('[data-testid="delete-board-button"]').first().click();
      cy.get('[data-testid="confirmation-modal"]').should('be.visible');
      cy.get('[data-testid="close-dialog-button"]').click();
      cy.get('[data-testid="confirmation-modal"]').should('not.exist');
    });

    it('should delete the board when the confirmation modal is submitted', () => {
      cy.visit('/');

      const lastBoardName = cy.get('.boards-list h3').last().invoke('text');

      cy.get('[data-testid="delete-board-button"]').first().click();
      cy.get('[data-testid="confirmation-modal"]').should('be.visible');
      cy.get('[data-testid="confirm-dialog-button"]').click();

      cy.get('.boards-list').should('be.visible');
      cy.get('.boards-list h3').should('not.contain.text', lastBoardName);
    });
  });
});
