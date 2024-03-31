// src/index.ts
import dns from "dns";
import * as net from "net";
var dnsPromises = dns.promises;
var emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
async function checkEmail(email, domain) {
  const formatCheck = emailFormat.test(email);
  if (!formatCheck)
    return false;
  const hostname = email.split("@")[1];
  if (domain && hostname != domain)
    return false;
  try {
    const addresses = await dnsPromises.resolveMx(hostname);
    if (addresses && addresses.length > 0) {
      const sortedAddresses = addresses.sort((a, b) => a.priority - b.priority);
      const firstAddress = sortedAddresses[0].exchange;
      let amountWritten = 0;
      let responseData = "";
      return new Promise((resolve) => {
        const connection = net.createConnection({ port: 25, host: firstAddress, timeout: 5e3 });
        connection.on("data", (data) => {
          responseData += data.toString();
          if (data.indexOf("220") === 0 || data.indexOf("250") === 0) {
            if (amountWritten < 2) {
              connection.write(`HELO ${firstAddress}\r
`);
              connection.write(`MAIL FROM: <noreply@example.com>\r
`);
              connection.write(`RCPT TO: <${email}>\r
`);
              connection.write("\r\n");
              amountWritten++;
            } else {
              connection.end();
            }
          } else {
            connection.end();
          }
        });
        connection.on("end", () => {
          if (responseData.indexOf("550") != -1 || responseData.indexOf("502") != -1 || responseData.indexOf("500") != -1) {
            resolve(false);
          } else if (responseData.indexOf("250") != -1 && responseData.indexOf("550") == -1 || responseData.indexOf("502") == -1 || responseData.indexOf("500") == -1) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
        connection.on("error", () => {
          resolve(false);
        });
      });
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}
export {
  checkEmail
};