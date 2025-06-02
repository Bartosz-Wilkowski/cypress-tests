import { faker } from '@faker-js/faker'

describe('Authentication', () => {

  // Ignore cross-origin script errors
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false prevents Cypress from failing the test
    return false;
  })

  beforeEach(() => {
    cy.visit('/my-account/')
  })

  context('Registration', () => {

    var user, email

    beforeEach(() => {
      // Set user data using faker.js
      email = faker.internet.email();
      user = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: email,
        userName: email.split('@')[0],
        password: faker.internet.password()
      }
    })

    it('should register a new user', () => {
      cy.get('#reg_email').type(user.email)
      cy.get('#reg_password').type(user.password)
      cy.get('[value="Register"]').click()
      cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${user.userName} (not ${user.userName}? Sign out)`)
    })

    it('should display an error for invalid email', () => {
      cy.get('#reg_email').type('invalid-email@test')
      cy.get('#reg_password').type(user.password)
      cy.get('[value="Register"]').click()
      cy.get('.woocommerce-error').should('contain.text', 'Error: Please provide a valid email address.')
    })

    it('should display an error for empty email', () => {
      cy.get('#reg_email').should('be.empty')
      cy.get('#reg_password').type(user.password)
      cy.get('[value="Register"]').click()
      cy.get('.woocommerce-error').should('contain.text', 'Error: Please provide a valid email address.')
    })

    it('should display an error for empty password', () => {
      cy.get('#reg_email').type(user.email)
      cy.get('#reg_password').should('be.empty')
      cy.get(':nth-child(4) > .button').click()
      cy.get('.woocommerce-error').should('contain.text', 'Error: Please enter an account password.')
    })

    const passwords = [
      { type: 'very weak', value: '123', error: 'Very weak - Please enter a stronger password.', bgcolor: '#f1adad' },
      { type: 'weak', value: '123A', error: 'Very weak - Please enter a stronger password.', bgcolor: '#fbc5a9' },
      { type: 'medium', value: '123AaT3st!', error: 'Medium', bgcolor: '#ffe399' },
      { type: 'strong', value: '123AaT3st!a', error: 'Strong', bgcolor: '#c1e1b9' },

    ]

    passwords.forEach(password => {
      it(`should validate password strength as ${password.type}`, () => {
        cy.get('#reg_password').type(password.value, { delay: 0 })
        if (password.type === 'very weak' || password.type === 'weak') {
          cy.get('.woocommerce-password-hint')
            .should('be.visible')
            .and('have.text', 'The password should be at least seven characters long. To make it stronger, use upper and lower case letters, numbers and symbols like ! " ? $ % ^ & ).')
        }
        else {
          cy.get('.woocommerce-password-hint').should('not.exist')
        }
        cy.get('.woocommerce-password-strength').should('have.css', 'background-color', password.bgcolor)
        cy.get('.woocommerce-password-strength').should('have.text', password.error)
      })
    })

  })

  context('Login', () => {

    var email, username, password

    beforeEach(function () {
      // load exisitng user data
      cy.fixture('user-data.json').as('registeredUser').then(() => {
        email = this.registeredUser.email
        username = this.registeredUser.username
        password = this.registeredUser.password
      })
    })

    it('should login a user with valid username and password', () => {
      cy.get('#username').type(username)
      cy.get('#password').type(password)
      cy.get('[name="login"]').click()
      cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${username} (not ${username}? Sign out)`)
    })

    it('should login a user with valid email and password', () => {
      cy.get('#username').type(email)
      cy.get('#password').type(password)
      cy.get('[name="login"]').click()
      cy.get('.woocommerce-MyAccount-content > p').first().should('contain.text', `Hello ${username} (not ${username}? Sign out)`)
    })

    it('should display an error for invalid email', () => {
      cy.get('#username').type('invalid-email1212@domain.random')
      cy.get('#password').type('12')
      cy.get('[name="login"]').click()
      cy.get('.woocommerce-error').should('contain.text', 'Error: A user could not be found with this email address.')
    })

    it('should display an error for empty password', () => {
      cy.get('#username').type(email)
      cy.get('[name="login"]').click()
      cy.get('.woocommerce-error').should('contain.text', 'Error: Password is required.')
    })

    it('should mask the password', () => {
      cy.get('#password').type(password, { delay: 0 })
      cy.get('#password').should('have.attr', 'type', 'password')
      cy.get('#password').compareSnapshot('masked-password')
    })

  })

  context('Logout', () => {

    var email, password

    beforeEach(function () {
      // load exisitng user data
      cy.fixture('user-data.json').as('registeredUser').then(() => {
        email = this.registeredUser.email
        password = this.registeredUser.password
        cy.login(email, password)
      })
    })

    it("should logout a user using 'Sign out' link", () => {
      cy.contains('a', 'Sign out').click()
      cy.location('pathname').should('include', '/my-account/')
    })

    it("should logout a user using 'Logout' link", () => {
      cy.contains('a', 'Logout').click()
      cy.location('pathname').should('include', '/my-account/')
    })

  })

})
