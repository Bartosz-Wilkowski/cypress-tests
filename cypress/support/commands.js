export function hexToRgb(hex) {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('')
  const num = parseInt(hex, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgb(${r}, ${g}, ${b})`
}

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

Cypress.Commands.add('fillInBillingDetails', (person) => {
  cy.get('#billing_first_name').type(person.firstName)
  cy.get('#billing_last_name').type(person.lastName)
  cy.get('#billing_email').type(person.email)
  cy.get('#billing_phone').type(person.phone)
  cy.get('#billing_country').select(person.country, { force: true })
  cy.get('#billing_address_1').type(person.streetAddress)
  cy.get('#billing_address_2').type(person.secondaryAddress)
  cy.get('#billing_city').type(person.city)
  cy.get('#billing_state').select(person.state, { force: true })
  cy.get('#billing_postcode').type(person.postcode)
})