const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql",
});

// 用户模型
const User = sequelize.define("User", {
  openid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  nickname: DataTypes.STRING,
  avatar: DataTypes.STRING,
  gender: DataTypes.INTEGER,
});

// 匹配记录模型
const Match = sequelize.define("Match", {
  status: {
    type: DataTypes.ENUM('waiting', 'matched', 'completed'),
    defaultValue: 'waiting'
  },
  userId1: DataTypes.INTEGER,
  userId2: DataTypes.INTEGER,
});

// 消息模型
const Message = sequelize.define("Message", {
  matchId: DataTypes.INTEGER,
  senderId: DataTypes.INTEGER,
  type: DataTypes.ENUM('text', 'voice', 'emoji'),
  content: DataTypes.TEXT,
  duration: DataTypes.INTEGER, // 语音消息时长
});

// 设置模型关联
User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

// 数据库初始化方法
async function init() {
  await User.sync({ alter: true });
  await Match.sync({ alter: true });
  await Message.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  User,
  Match,
  Message,
  sequelize,
};
