const Router = require('koa-router');
const { User } = require('../db');

const router = new Router({ prefix: '/user' });

// 获取用户信息
router.get('/info', async (ctx) => {
  const { userId } = ctx.state;
  const user = await User.findByPk(userId);
  if (!user) {
    ctx.throw(404, '用户不存在');
  }
  ctx.body = user;
});

// 更新用户信息
router.put('/info', async (ctx) => {
  const { userId } = ctx.state;
  const { nickname, avatar, gender } = ctx.request.body;
  
  const user = await User.findByPk(userId);
  if (!user) {
    ctx.throw(404, '用户不存在');
  }
  
  await user.update({
    nickname,
    avatar,
    gender
  });
  
  ctx.body = user;
});

module.exports = router; 