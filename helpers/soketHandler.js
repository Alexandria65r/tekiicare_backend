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
    socket.on(types.call_user, (call) => {
      console.log(call);
      socket.to(call.to).emit("incoming_call", call);
    });

    // Answer private call
    socket.on(types.AnswerCall, (call) => {
      console.log("===============Call================");
      console.log(call);
      // socket.to(call.callId).emit("connect-sender");
      // socket.to(call.to).emit('connect-me');
      socket.to(call.callId).emit("connect-caller", call);
      
    });

    socket.on("connect-me", (call) => {
      socket.to(call.to).emit("connect-user", call);
    });


    socket.on("signal_to_reciever", ({ to, data }) => {
       console.log('signal_to_reciever');
      socket.to(to).emit("reciever_get_signal", data);
    });

    socket.on("signal_to_caller", ({ callId, data }) => {
        console.log("signal_to_caller");
      socket.to(callId).emit("caller_get_signal", data);
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
