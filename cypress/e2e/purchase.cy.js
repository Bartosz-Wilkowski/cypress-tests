import { faker, fakerEN_US } from '@faker-js/faker'

describe("Purchase", function () {
  // Ignore cross-origin script errors
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false prevents Cypress from failing the test
    return false;
  });

  beforeEach(function () {
    cy.visit("/shop/")
  })

  it("should add a product to the cart", function () {
    cy.contains('Functional Programming in JS').click()
    cy.location('pathname').should('include', '/product/functional-programming-in-js/')
    cy.get('.single_add_to_cart_button').click()
    cy.get('.woocommerce-message')
      .should('be.visible')
      .and('contain', '“Functional Programming in JS” has been added to your basket.')
  })

  it("should add a product to the cart using button in products list", function () {
    cy.get('.add_to_cart_button').first().click()
    cy.get('.add_to_cart_button').first().should('have.class', 'added')
  })

  it("should proceed to checkout", function () {
    cy.addToBasket('Functional Programming in JS')
    cy.get('.checkout-button').click()
    cy.location('pathname').should('include', '/checkout/')
    cy.get('.woocommerce-checkout').should('be.visible')
  })

  context("Proceed as a guest", function () {

    beforeEach(function () {
      const guest = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: fakerEN_US.phone.number({ style: 'international' }),
        country: 'United States (US)',
        streetAddress: fakerEN_US.location.streetAddress(),
        secondaryAddress: fakerEN_US.location.secondaryAddress(),
        city: fakerEN_US.location.city(),
        state: 'California',
        postcode: fakerEN_US.location.zipCode('#####')
      }
      cy.wrap(guest).as('guest')
      cy.addToBasket('Functional Programming in JS')
      cy.get('.checkout-button').click()

    })

    it("should fill in the checkout form and place an order", function () {
      cy.get('@guest').then(guest => {
        // Fill in the billing details
        cy.get('#billing_first_name').type(guest.firstName)
        cy.get('#billing_last_name').type(guest.lastName)
        cy.get('#billing_email').type(guest.email)
        cy.get('#billing_phone').type(guest.phone)
        cy.get('#billing_country').select(guest.country, { force: true })
        cy.get('#billing_address_1').type(guest.streetAddress)
        cy.get('#billing_address_2').type(guest.secondaryAddress)
        cy.get('#billing_city').type(guest.city)
        cy.get('#billing_state').select(guest.state, { force: true })
        cy.get('#billing_postcode').type(guest.postcode)
        // Select payment method
        cy.get('#payment_method_cod').check() // Select Cash on Delivery
        // Place the order
        cy.get('#place_order').click()
        // Verify the order confirmation
        cy.get('.woocommerce-thankyou-order-received').should('contain', 'Thank you. Your order has been received.')
        cy.get('.woocommerce-thankyou-order-details')
          .should('contain', 'Order number:')
          .and('contain', 'Date:')
          .and('contain', 'Payment method:')
          .and('contain', 'Cash on Delivery')
      })
    })

    it("should display an error when required billing fields are missing - phone", function () {
      cy.get('@guest').then(guest => {
        cy.fillInBillingDetails(guest)
      })
      cy.get('#billing_phone').clear() // Clear the phone field to trigger the error
      cy.get('#place_order').click()
      cy.get('.woocommerce-error')
        .should('contain', 'Billing Phone is a required field.')
        .compareSnapshot('billing-details-error')
    })

  })

})