const Router = require('koa-router');
const { Match, User } = require('../db');

const router = new Router({ prefix: '/match' });

// 开始匹配
router.post('/start', async (ctx) => {
  const { userId } = ctx.state;
  
  // 检查是否已在匹配中
  const existingMatch = await Match.findOne({
    where: {
      status: 'waiting',
      userId1: userId
    }
  });
  
  if (existingMatch) {
    ctx.throw(400, '已在匹配队列中');
  }
  
  // 查找其他等待匹配的用户
  const pendingMatch = await Match.findOne({
    where: {
      status: 'waiting',
      userId1: { [Op.ne]: userId }
    }
  });
  
  if (pendingMatch) {
    // 找到匹配对象
    await pendingMatch.update({
      userId2: userId,
      status: 'matched'
    });
    ctx.body = { matchId: pendingMatch.id };
  } else {
    // 创建新的匹配记录
    const match = await Match.create({
      userId1: userId,
      status: 'waiting'
    });
    ctx.body = { matchId: match.id };
  }
});

// 取消匹配
router.post('/cancel', async (ctx) => {
  const { userId } = ctx.state;
  
  await Match.destroy({
    where: {
      status: 'waiting',
      userId1: userId
    }
  });
  
  ctx.body = { success: true };
});

// 获取匹配状态
router.get('/status', async (ctx) => {
  const { userId } = ctx.state;
  
  const match = await Match.findOne({
    where: {
      [Op.or]: [
        { userId1: userId },
        { userId2: userId }
      ],
      status: ['waiting', 'matched']
    }
  });
  
  ctx.body = match || { status: 'none' };
});

module.exports = router; 