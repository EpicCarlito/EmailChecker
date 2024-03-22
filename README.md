# EmailChecker

A simple way to check if an email exists! You can also check the domain of the email.
**Warning:** Port 25 must be allowed! (Or email checks return false)

## Installation

    npm i @epiccarlito/emailchecker

### TypeScript

    import checkEmail from "@epiccarlito/emailchecker";

### JavaScript

    const checkEmail = require("@epiccarlito/emailchecker").default;
    
### Example Code

    async function main() {
    	let result = await checkEmail("exampleemail@gmail.com", "gmail.com");
    	return result;
    }
    main(); // Returns false
    
## Original Concept

Inspired by [email-existance](https://github.com/nmanousos/email-existence). Both packages check the codes of the MX server to identify if an email address accepts emails and exists.