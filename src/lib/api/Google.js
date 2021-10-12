"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Google = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const googleapis_1 = require("googleapis");
const axios_1 = __importDefault(require("axios"));
const auth = new googleapis_1.google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, `${process.env.PUBLIC_URL}/login`);
exports.Google = {
    authUrl: auth.generateAuthUrl({
        access_type: 'online',
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ]
    }),
    logIn: (code) => __awaiter(void 0, void 0, void 0, function* () {
        const { tokens } = yield auth.getToken(code);
        auth.setCredentials(tokens);
        const { data } = yield googleapis_1.google.people({ version: "v1", auth }).people.get({
            resourceName: "people/me",
            personFields: "emailAddresses,names,photos"
        });
        return { user: data };
    }),
    geocode: (address) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield axios_1.default
            .post(`http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.M_GEOCODE_KEY}`, {
            "location": address,
            "options": {
                thumbMaps: false
            }
        })
            .then((res) => {
            const location = res.data.results[0].locations[0];
            const country = location.adminArea1;
            const admin = location.adminArea3;
            const city = location.adminArea5;
            return { country, admin, city };
        })
            .catch(error => {
            console.error(error);
        });
        return data;
    })
};
