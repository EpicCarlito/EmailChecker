"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  checkEmail: () => checkEmail
});
module.exports = __toCommonJS(src_exports);
var import_dns = __toESM(require("dns"));
var net = __toESM(require("net"));
var dnsPromises = import_dns.default.promises;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkEmail
});
