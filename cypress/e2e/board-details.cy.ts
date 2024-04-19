describe('Board Details', () => {
  before(() => {
    indexedDB.deleteDatabase('TaskManagerDB');
  });

  describe('Load tasks from the board', () => {
    it('should display the 4 sections of the board', () => {
      cy.visit('/boards/1');
      cy.get('[data-testid=task-section]').should('have.length', 4);
    });

    it('should display the tasks of the board', () => {
      cy.visit('/boards/1');
      cy.get('task-card').should('have.length.at.least', 1);
    });

    it('should reorder the sections of the board using drag and drop', () => {
      cy.visit('/boards/1');

      cy.get('[data-testid=drag-handle]')
        .first() // draggable
        .trigger('mousedown', { button: 0, bubbles: true })
        .trigger('mousemove', { pageX: 10, pageY: 0 });

      cy.get('[data-testid=task-section]')
        .eq(1) // droppable
        .trigger('mousemove', { position: 'top' })
        .trigger('mouseup', { button: 0, bubbles: true });

      cy.get('[data-testid=task-section]')
        .first()
        .find('ol')
        .invoke('attr', 'id')
        .should('eq', 'in-progress');
    });

    it('should reorder the tasks of a section using drag and drop', () => {
      cy.visit('/boards/1');

      cy.get('[data-testid=task-card] .task-title').first().invoke('text').as('taskTitle');

      // Drag the first task card
      cy.get('[data-testid=task-section]')
        .first()
        .find('[data-testid=task-card]')
        .first()
        .trigger('mousedown', { button: 0, bubbles: true })
        .trigger('mousemove', { pageX: 10, pageY: 0 });

      // Move the task card to the last position of the first section
      cy.get('[data-testid=task-section]')
        .first()
        .find('[data-testid=task-card]:not(.cdk-drag-preview, .cdk-drag-placeholder)')
        .last()
        .trigger('mousemove', { position: 'bottom' })
        .trigger('mouseup', { button: 0, bubbles: true });

      // Check if the first task is now the last task
      cy.get('@taskTitle').then((taskTitle) => {
        cy.get('[data-testid=task-section]')
          .first()
          .find('[data-testid=task-card]:not(.cdk-drag-preview, .cdk-drag-placeholder) .task-title')
          .last()
          .should('contain.text', taskTitle);
      });
    });

    it('should move a task to another section using drag and drop', () => {
      cy.visit('/boards/1');

      cy.get('[data-testid=task-card] .task-title')
        .first()
        .then(($taskTitle) => {
          const text = $taskTitle.text();

          // Drag the first task card
          cy.get('[data-testid=task-section]')
            .first()
            .find('[data-testid=task-card]')
            .first()
            .trigger('mousedown', { button: 0, bubbles: true })
            .trigger('mousemove', { pageX: 10, pageY: 0 });

          // Move the task card to the first position of the second section
          cy.get('[data-testid=task-section]')
            .eq(1)
            .find('[data-testid=task-card]:not(.cdk-drag-preview, .cdk-drag-placeholder)')
            .first()
            .trigger('mousemove', { position: 'top' })
            .trigger('mouseup', { button: 0, bubbles: true });

          // Check if the first task is in the second section is now the dragged task
          cy.get('[data-testid=task-section]')
            .eq(1)
            .find(
              '[data-testid=task-card]:not(.cdk-drag-preview, .cdk-drag-placeholder) .task-title'
            )
            .first()
            .should('contain.text', text);
        });
    });
  });
});
