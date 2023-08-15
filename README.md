# EmailChecker

A simple way to check if an email exists

## Installation

    npm i @epiccarlito/emailchecker

### TypeScript

    import { checkEmail } from "@epiccarlito/emailchecker"

### JavaScript

    const emailchecker = require("@epiccarlito/emailchecker")

### Example Code


    async function main() {
      let result = await checkEmail('e@test.com'); // For TypeScript
    }

    main();

    let result = await emailchecker.checkEmail('e@test.com'); // For Javascript


## Warning

Make sure Port 25 is allowed! If the port is blocked, all email checks will return false.

## Original Idea

[email-existance](https://github.com/nmanousos/email-existence), I used the same method of this package checking the codes of MX servers, however, I made it on TypeScript and made it simpler for ease of use!