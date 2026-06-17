const express = require("express");
const cors = require("cors");
const app = express();

// 配置跨域选项
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

// 设置静态文件目录
app.use(express.static("public"));

// 允许express解析POST请求的body数据
app.use(express.json()); // 用于解析application/json
app.use(express.urlencoded({ extended: true })); // 用于解析application/x-www-form-urlencoded

app.get("/other", (req, res) => {
  res.sendFile(__dirname + "/public/other.html");
});

app.post("/log", (req, res) => {
  // 从请求体中获取数据
  const data = req.body;

  // 打印数据到控制台，或者根据数据执行其他逻辑
  console.log(data);

  // 响应请求
  res.send(JSON.stringify({ message: "数据接收成功", data: data }));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 运行服务器 node app.js
