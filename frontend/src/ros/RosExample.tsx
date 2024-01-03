import { Ros, Message, Topic } from "roslib"

export const RosExample = () => {
  const ros = new Ros({url: "ws://127.0.0.1:2794"})

  ros.on("connection", function() {
    console.log("Connected to websocket server.")
  })
  ros.on("error", function(error) {
    console.log("Error connecting to websocket server: ", error)
  })
  ros.on("close", function() {
    console.log("Connection to websocket server closed.")
  })

  // Publishing a Topic
  const cmdVel = new Topic({
    ros: ros,
    name: "/cmd_vel",
    messageType: "geometry_msgs/Twist"
  })
  const twist = new Message({
    linear: {
      x: 0.1,
      y: 0.2,
      z: 0.3
    },
    angular: {
      x: -0.1,
      y: -0.2,
      z: -0.3
    }
  })
  cmdVel.publish(twist)

  // Subscribing to a Topic
  const listener = new Topic({
    ros: ros,
    name: "/listener",
    messageType: "std_msgs/String"
  })
  listener.subscribe(function(message) {
    console.log("Received message on " + listener.name + ": " + (message as string))
    listener.unsubscribe()
  })
}