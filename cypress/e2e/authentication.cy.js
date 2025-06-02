import { faker } from '@faker-js/faker'
import { hexToRgb } from '../support/commands'

describe('Authentication', function () {

  // Ignore cross-origin script errors
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false prevents Cypress from failing the test
    return false;
  })

  beforeEach(function () {
    cy.visit('/my-account/')
  })

  context('Registration', function () {

    beforeEach(function () {
      const email = faker.internet.email();
      const user = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: email,
        userName: email.split('@')[0],
        password: faker.internet.password()
      }
      cy.wrap(user).as('user');
    })

    it('should register a new user', function () {
      cy.get('@user').then(user => {
        cy.get('#reg_email').type(user.email)
        cy.get('#reg_password').type(user.password)
        cy.get('[value="Register"]').click()
        cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${user.userName} (not ${user.userName}? Sign out)`)
      })
    })

    it('should display an error for invalid email', function () {
      cy.get('@user').then(user => {
        cy.get('#reg_email').type('invalid-email@test')
        cy.get('#reg_password').type(user.password)
        cy.get('[value="Register"]').click()
        cy.get('.woocommerce-error').should('contain.text', 'Error: Please provide a valid email address.')
      })
    })

    it('should display an error for empty email', function () {
      cy.get('@user').then(user => {
        cy.get('#reg_email').should('be.empty')
        cy.get('#reg_password').type(user.password)
        cy.get('[value="Register"]').click()
        cy.get('.woocommerce-error').should('contain.text', 'Error: Please provide a valid email address.')
      })
    })

    it('should display an error for empty password', function () {
      cy.get('@user').then(user => {
        cy.get('#reg_email').type(user.email)
        cy.get('#reg_password').should('be.empty')
        cy.get(':nth-child(4) > .button').click()
        cy.get('.woocommerce-error').should('contain.text', 'Error: Please enter an account password.')
      })
    })

    const passwords = [
      { type: 'very weak', value: '123', error: 'Very weak - Please enter a stronger password.', bgcolor: '#f1adad' },
      { type: 'weak', value: '123A', error: 'Weak - Please enter a stronger password.', bgcolor: '#fbc5a9' },
      { type: 'medium', value: '123AaT3st!', error: 'Medium', bgcolor: '#ffe399' },
      { type: 'strong', value: '123AaT3st!a', error: 'Strong', bgcolor: '#c1e1b9' },
    ]

    passwords.forEach(password => {
      it(`should validate password strength as ${password.type}`, function () {
        cy.get('#reg_password').type(password.value)
        if (password.type === 'very weak' || password.type === 'weak') {
          cy.get('.woocommerce-password-hint')
            .should('be.visible')
            .and('have.text', 'The password should be at least seven characters long. To make it stronger, use upper and lower case letters, numbers and symbols like ! " ? $ % ^ & ).')
        }
        else {
          cy.get('.woocommerce-password-hint').should('not.exist')
        }
        cy.get('.woocommerce-password-strength').should('have.css', 'background-color', hexToRgb(password.bgcolor))
        cy.get('.woocommerce-password-strength').should('have.text', password.error)
      })
    })

  })

  context('Login', function () {

    beforeEach(function () {
      // Load existing user data
      cy.fixture('user-data.json').as('registeredUser')
    })

    it('should login a user with valid username and password', function () {
      cy.get('@registeredUser').then(user => {
        cy.get('#username').type(user.username)
        cy.get('#password').type(user.password)
        cy.get('[name="login"]').click()
        cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${user.username} (not ${user.username}? Sign out)`)
      })
    })

    it('should login a user with valid email and password', function () {
      cy.get('@registeredUser').then(user => {
        cy.get('#username').type(user.email)
        cy.get('#password').type(user.password)
        cy.get('[name="login"]').click()
        cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${user.username} (not ${user.username}? Sign out)`)
      })
    })

    it('should display an error for invalid email', function () {
      cy.get('#username').type('invalid-email1212@domain.random')
      cy.get('#password').type('12')
      cy.get('[name="login"]').click()
      cy.get('.woocommerce-error').should('contain.text', 'Error: A user could not be found with this email address.')
    })

    it('should display an error for empty password', function () {
      cy.get('@registeredUser').then(user => {
        cy.get('#username').type(user.email)
        cy.get('[name="login"]').click()
        cy.get('.woocommerce-error').should('contain.text', 'Error: Password is required.')
      })
    })

    it('should mask the password', function () {
      cy.get('@registeredUser').then(user => {
        cy.get('#password').type(user.password, { delay: 0 })
        cy.get('#password').should('have.attr', 'type', 'password')
        cy.get('#password').compareSnapshot('masked-password')
      })
    })

  })

  context('Logout', function () {

    beforeEach(function () {
      // Load exisitng user data
      cy.fixture('user-data.json').as('registeredUser')
      cy.get('@registeredUser').then(registeredUser => {
        cy.login(registeredUser.email, registeredUser.password)
      })
    })

    it("should logout a user using 'Sign out' link", function () {
      cy.contains('a', 'Sign out').click()
      cy.location('pathname').should('include', '/my-account/')
    })

    it("should logout a user using 'Logout' link", function () {
      cy.contains('a', 'Logout').click()
      cy.location('pathname').should('include', '/my-account/')
    })

  })

})
