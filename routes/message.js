const Router = require('koa-router');
const { Message, Match } = require('../db');

const router = new Router({ prefix: '/message' });

// 发送文本消息
router.post('/text', async (ctx) => {
  const { userId } = ctx.state;
  const { matchId, content } = ctx.request.body;
  
  const message = await Message.create({
    matchId,
    senderId: userId,
    type: 'text',
    content
  });
  
  ctx.body = message;
});

// 发送语音消息
router.post('/voice', async (ctx) => {
  const { userId } = ctx.state;
  const { matchId, content, duration } = ctx.request.body;
  
  const message = await Message.create({
    matchId,
    senderId: userId,
    type: 'voice',
    content,
    duration
  });
  
  ctx.body = message;
});

// 发送表情消息
router.post('/emoji', async (ctx) => {
  const { userId } = ctx.state;
  const { matchId, content } = ctx.request.body;
  
  const message = await Message.create({
    matchId,
    senderId: userId,
    type: 'emoji',
    content
  });
  
  ctx.body = message;
});

// 获取历史消息
router.get('/history', async (ctx) => {
  const { matchId, page = 1, pageSize = 20 } = ctx.query;
  
  const messages = await Message.findAndCountAll({
    where: { matchId },
    include: [{
      model: User,
      attributes: ['nickname', 'avatar']
    }],
    order: [['createdAt', 'DESC']],
    limit: pageSize,
    offset: (page - 1) * pageSize
  });
  
  ctx.body = messages;
});

module.exports = router; 