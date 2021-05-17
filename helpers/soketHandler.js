const { ...types } = require("./constants");
let users = [];
module.exports = (io) => {
  //create socket connection
  io.on("connection", (socket) => {
    console.log("client connected");
    socket.emit("connection", { connected: true });

    socket.on("client-connected", (id) => {
      console.log(`client id is ${id}`);
    });

    //JOIN ROOM
    socket.on(types.JoinRoom, (user) => {
      console.log("socket.id");
      console.log(socket.id);
      console.log(user.id);
      socket.join(user.room);
      console.log("room");
      console.log(user);
      users = [user, ...users];

      socket.emit(types.UserJoinedRoom, true);
      io.to(user.room).emit(types.GetConnectedUsers, users);
      console.log(users);

      socket.on("disconnect", () => {
        removeDisconnectedUser(socket.id);
        console.log(`disconnected user ${socket.id}`);
      });
    });

    // private call
    socket.on(types.SendVoiceCall, (from) => {
      socket.to(from.user.to).emit(types.RecieveVoiceCall, from);
    });

    // Answer private call
    socket.on(types.AnswerCall, (Call) => {
      console.log(Call)
      socket.to(Call.id).emit(types.call_connected, Call.data);
    });

    //Cancel private call
    socket.on(types.CancelCall, (ongoingCall) => {
      console.log(ongoingCall);
      socket.to(ongoingCall.id).emit(types.CallCanceled);
    });

    function removeDisconnectedUser(id) {
      const usersCopy = [...users];
      const disconnected_user = users.find((u) => u.id === id);
      const index = users.indexOf(disconnected_user);
      users.splice(index, 1);
      //users = usersCopy;
      //send the remaining users list
      io.to(disconnected_user.room).emit(types.GetConnectedUsers, users);
    }
  });
};