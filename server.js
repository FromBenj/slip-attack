import express from "express";
import session from 'express-session';
import db from "./db/db.js";
import BetterSqliteStore from 'better-sqlite3-session-store';
import path from "node:path";
import setRoutes from "./back/config/routes.js";
import dotenv from "dotenv";
import mustacheConfig from "./back/config/mustache-config.js";

const root = process.cwd();
dotenv.config({path: `.env.${process.env.NODE_ENV || "development"}`});

const app = express();
const Store = BetterSqliteStore(session);

app.use(express.json());
app.use(express.static(path.join(root, 'public')));
mustacheConfig(app, root);

app.set('trust proxy', 1);
app.use(session({
    store: new Store({client: db}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 7 * 24 * 60 * 60 * 1000}
}));

setRoutes(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`))

console.log("Express is working 🏝️")
