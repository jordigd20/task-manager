declare global {
  interface Window {
    store: any;
    ngZone: any;
  }
}

export function dispatchAction(action: any): Cypress.Chainable<any> {
  cy.window().should('have.property', 'store');
  cy.window().should('have.property', 'ngZone');
  return cy.window().then((w) => {
    w.ngZone.run(() => {
      w.store.dispatch(action);
    });
  });
}
