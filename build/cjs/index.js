"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
const dnsPromises = dns_1.default.promises;
const net = __importStar(require("net"));
const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
async function checkEmail(email, domain) {
    const formatCheck = emailFormat.test(email);
    if (!formatCheck)
        return false;
    const hostname = email.split("@")[1];
    if (hostname != domain)
        return false;
    try {
        const addresses = await dnsPromises.resolveMx(hostname);
        if (addresses && addresses.length > 0) {
            const sortedAddresses = addresses.sort((a, b) => a.priority - b.priority);
            const firstAddress = sortedAddresses[0].exchange;
            let amountWritten = 0;
            let responseData = '';
            return new Promise((resolve) => {
                const connection = net.createConnection({ port: 25, host: firstAddress, timeout: 5000 });
                connection.on('data', (data) => {
                    responseData += data.toString();
                    if (data.indexOf("220") === 0 || data.indexOf("250") === 0) {
                        if (amountWritten < 2) {
                            connection.write(`HELO ${firstAddress}\r\n`);
                            connection.write(`MAIL FROM: <noreply@example.com>\r\n`);
                            connection.write(`RCPT TO: <${email}>\r\n`);
                            connection.write('\r\n');
                            amountWritten++;
                        }
                        else {
                            connection.end();
                        }
                    }
                    else {
                        connection.end();
                    }
                });
                connection.on('end', () => {
                    if (responseData.indexOf("550") != -1 || responseData.indexOf("502") != -1 || responseData.indexOf("500") != -1) {
                        resolve(false);
                    }
                    else if (responseData.indexOf("250") != -1 && responseData.indexOf("550") == -1 || responseData.indexOf("502") == -1 || responseData.indexOf("500") == -1) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
                connection.on('error', () => {
                    resolve(false);
                });
            });
        }
        else {
            return false;
        }
    }
    catch (err) {
        return false;
    }
}
exports.default = checkEmail;
