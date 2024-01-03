export const WS_Client = () => {
  const socket = new WebSocket("ws://127.0.0.1:2794", "rust-websocket")

  socket.onerror = function(event) {
    console.log(event)
  }

  socket.onmessage = function(event) {
    console.log(event.data)
  }
  
  socket.onopen = function() {
    socket.send("[Client] Hello, server!")
  }
}