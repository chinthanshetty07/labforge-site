# Spec 002: Book-a-demo form

## Acceptance criteria
- **AC-2.1** Fields: name, work email, company, number of learners (select). All required.
- **AC-2.2** Submitting empty shows an error next to each required field and moves focus to the first invalid one.
- **AC-2.3** Personal email domains (gmail.com, yahoo.com, outlook.com, hotmail.com) are rejected with
  "Please use your work email".
- **AC-2.4** A valid submission shows "Thanks, we'll be in touch within 1 working day", announced to screen
  readers (`role="status"`), and clears the form.
- **AC-2.5** Errors clear as soon as the field becomes valid.
- **AC-2.6** No data leaves the page: this is a static site, so the form must not send a network request.
