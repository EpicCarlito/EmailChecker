# EmailChecker

A simple way to check if an email exists

## Warning

Make sure Port 25 is allowed! If the port is blocked, all email checks will return false.

## Installation

    npm i @epiccarlito/emailchecker

### TypeScript

    import { checkEmail } from "@epiccarlito/emailchecker"

### JavaScript

    const emailchecker = require("@epiccarlito/emailchecker")

### Example Code


    async function main() {
      let result = await checkEmail('e@gmail.com'); // For TypeScript
      let result = await emailchecker.checkEmail('e@gmail.com'); // For Javascript
      console.log(result)
    }

    main(); // Prints result which is false


## Original Idea

[email-existance](https://github.com/nmanousos/email-existence), I used the same method of checking the codes that the MX server responds back with, which can identify if the email can accept emails and exists. I remade it using TypeScript and made it simpler for ease of use by using async and await rather than callbacks.