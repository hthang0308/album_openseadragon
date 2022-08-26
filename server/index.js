const express = require("express");
const morgan = require("morgan");
const app = express();

const connectDB = require("./config/database");
const routes = require("./routes");
const cors = require("cors");

//cookie
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 5000;

// HTTP logger
app.use(morgan("dev"));

// Connect to database
connectDB();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//Cookie middleware
app.use(cookieParser());

// Routes
routes(app);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
