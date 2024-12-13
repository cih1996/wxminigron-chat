const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { init } = require('./db');
const userRouter = require('./routes/user');
const matchRouter = require('./routes/match');
const messageRouter = require('./routes/message');

const app = new Koa();

// 中间件
app.use(bodyParser());

// 路由
app.use(userRouter.routes());
app.use(matchRouter.routes());
app.use(messageRouter.routes());

// 初始化数据库并启动服务器
async function start() {
  await init();
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

start(); 