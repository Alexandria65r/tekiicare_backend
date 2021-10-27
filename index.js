const express = require("express");

const { createServer } = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const server = createServer(app);
const dev = process.env.NODE_ENV !== "production";
const PORT = dev ? 5505 : process.env.PORT;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const socketHandler = require("./helpers/soketHandler");
const routesHandler = require("./helpers/routesHandler");

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  })
);

app.use(cookieParser());
app.use(express.json());

routesHandler(app);

app.get("/", (req, res) => {
  res.send("Server is running...🍕");
});

//call the socketHandler
socketHandler(io);

server.listen(PORT, (err) => {
  if (err) console.log("server connection errr");
  console.log(`server started on port ${PORT}`);
});
