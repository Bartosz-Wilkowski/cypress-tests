Cypress.Commands.add('addToBasket', (productName) => {
  cy.url().then((url) => {
    if (!url.endsWith('/shop/')) {
      cy.visit('/shop/')
    }
  })
  cy.contains(`${productName}`).click()
  // Convert productName to slug format
  const slug = productName.toLowerCase().replace(/\s+/g, '-');
  cy.location('pathname').should('include', `/product/${slug}/`)
  cy.get('.single_add_to_cart_button').click()
  cy.get('.woocommerce-message')
    .should('be.visible')
    .and('contain', `“${productName}” has been added to your basket.`)
  cy.contains('a', 'View Basket').click()
  cy.url().should('include', '/basket/')
})

Cypress.Commands.add('login', (email, password) => {
  const username = email.split('@')[0] // Extract username from email
  cy.visit('/my-account/')
  cy.get('#username').type(email)
  cy.get('#password').type(password)
  cy.get('[name="login"]').click()
  cy.url().should('include', '/my-account/')
  cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${username} (not ${username}? Sign out)`)
})