describe('Core Features', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('loads the application correctly', () => {
        cy.contains('Setup').should('be.visible');
        cy.contains('Images').should('be.visible');
        cy.get('.paper-sheet').should('be.visible');
    });

    it('allows uploading an image', () => {
        // Switch to Images tab
        cy.contains('Images').click();

        // We need a dummy image to upload.
        // Ideally we'd use a fixture, but for now let's create a blob dynamically or just use a placeholder if we can.
        // Or we can rely on the fact that we can just trigger the handler if we mock the input?
        // Cypress selectFile is powerful.

        // Create a dummy image file
        const fileName = 'test-image.png';
        cy.fixture(fileName).then(fileContent => {
            cy.get('input[type="file"]').selectFile({
                contents: fileContent,
                fileName,
                mimeType: 'image/png'
            }, { force: true }); // force because input is hidden
        });

        // Check if thumbnail appears
        cy.get('.image-thumb').should('have.length', 1);

        // Check if standee appears on canvas
        cy.get('.standee-wrapper').should('have.length', 1);
    });

    it('allows changing standee size', () => {
        // Switch to Images tab & Upload
        cy.contains('Images').click();
        const fileName = 'test-image.png';
        cy.fixture(fileName).then(fileContent => {
            cy.get('input[type="file"]').selectFile({
                contents: fileContent,
                fileName,
                mimeType: 'image/png'
            }, { force: true });
        });

        // Select the standee (it should be selected automatically)
        // Switch to Controls tab (should be auto switch)
        cy.contains('Controls').should('have.class', 'active');

        // Change size
        cy.contains('Small').click();

        // Verify height input changed
        cy.get('input[value="38"]').should('exist');

        // Verify on canvas
        // Width and Height are inline styles.
        // 38mm to px (approx 3.78 * 38 = 143.6)
        // plus margins...
        cy.get('.standee-wrapper').should('have.attr', 'style').and('include', 'height:');
    });

    it('allows export PDF', () => {
        cy.contains('Export').click();
        cy.contains('Generate PDF').should('be.visible').and('not.be.disabled');
        // We can't easily verify download in this valid scope without plugins or chrome prefs
        // But we can verify it clicks without error.
        cy.contains('Generate PDF').click();
    });

    it('allows pasting an image', () => {
        const fileName = 'test-image.png';
        cy.fixture(fileName).then(fileContent => {
            // Convert blob/base64 to a file objectish thing for clipboard
            // Cypress clipboard simulation is tricky. 
            // We can trigger the paste event on the window or document.

            // For now, let's manually trigger the paste event on the window
            // with a mocked clipboardData
            cy.window().trigger('paste', {
                clipboardData: {
                    files: [
                        new File([fileContent], fileName, { type: 'image/png' })
                    ],
                    length: 1
                }
            });
        });

        // Check if standee appears (it might take a moment for FileReader)
        cy.get('.standee-wrapper', { timeout: 1000 }).should('have.length.at.least', 1);
    });
});
