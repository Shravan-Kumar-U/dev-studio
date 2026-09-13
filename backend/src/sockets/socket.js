const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  const corsOptions = {
    origin: function (origin, callback) {
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_CLIENT_URL];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  };

  io = new Server(server, {
    cors: corsOptions
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };