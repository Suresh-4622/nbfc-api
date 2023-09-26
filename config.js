import dotenv from "dotenv";
dotenv.config({ silent: true });
const { PORT,SESSION_TOKEN } = process.env;


//port
export const port = PORT;
export const TOKEN_KEY = SESSION_TOKEN;
