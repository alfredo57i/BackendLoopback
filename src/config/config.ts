require('dotenv').config();

export namespace Config {
  export const claveJWT = process.env.claveJWT;
  export const baseURL = process.env.baseURL;
}
