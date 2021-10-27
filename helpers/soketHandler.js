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

      io.to(user.room).to(user.id).emit("work-started", true);

      socket.to(user.room).emit(types.UserJoinedRoom);
      
      io.to(user.room).emit(types.GetConnectedUsers, users);
      console.log(users);

      socket.on("disconnect", () => {
        broadCastWhenUserDisconnects(socket.id);
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
      socket.to(call.callId).emit("connect-caller", call);
    });

    //once the user accepts the call,
    //pass the signal to the caller
    socket.on("signal_to_caller", ({ callId, data }) => {
      socket.to(callId).emit("caller_get_signal", data);
    });

    //Cancel private call
    socket.on(types.CancelCall, (ongoingCall) => {
      console.log(ongoingCall);
      socket.to(ongoingCall.id).emit(types.CallCanceled);
    });

    // on call ringning

    socket.on("call-ringing", ({ callerId }) => {
      console.log(`ringing caller id => ${callerId}`);
      socket.to(callerId).emit("call_is_ringing", true);
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

    function broadCastWhenUserDisconnects(id) {
      const disconnected_user = users.find((u) => u.id === id);
      io.to(disconnected_user.room).emit("user_disconnected", id);
    }
  });
};
