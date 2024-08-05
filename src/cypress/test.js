describe('My First Test', function () {
    it('Visits the home page', function () {
        cy.visit('/')
        cy.contains('Pride Aquaculture')
    })

    it('Navigates to the About page', function () {
        cy.get('a[href="/aboutus"]').click()
        cy.url().should('include', '/aboutus')
        cy.contains('About')
    })

    it('Logs in with Google', function () {
        cy.get('a[href="/google"]').click()
        // Additional steps to handle Google OAuth could be added here
    })
})
