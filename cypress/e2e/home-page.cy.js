describe("Home page", () => {
  // Ignore cross-origin script errors
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false prevents Cypress from failing the test
    return false;
  });

  beforeEach(() => {
    cy.visit("/")
    // Click on Shop Menu
    cy.get('[id="menu-item-40"]').click()
    // Click on Home menu button
    cy.get('[id="site-logo"]').click()
  })

  it("should display exactly three slider elements", () => {
    // The Home page must contains only three sliders
    cy.get('.n2-ss-slide').should('have.length', 3)
  })

  it("should navigate to the product page when an Arrivals item is clicked", () => {
    // The Home page must contains only three arrivals
    cy.get('ul.products').eq(1).click()
    cy.url().should('include', '/product/thinking-in-html/')
  })

  it("should match the visual snapshot", () => {
    cy.get('[id="headerwrap"]').invoke('css', 'display', 'none') // Hide the header 
    cy.get('.row_inner_wrapper').first().compareSnapshot('header', { capture: 'viewport' })
  })
})