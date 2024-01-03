interface MessageEventData {
  gid: string
  command: string
  topic: string
  message: string
}

const onMessage = ( event: MessageEvent ) => {
  const msgData: MessageEventData = event.data as MessageEventData
  if ( msgData.command == "console" ) {
    const rawMessage = msgData.message
    const msg = rawMessage.substr( 4, rawMessage.length - 8 )
    console.log( msg )
  }
}

export const RosWasm = () => {
  const talker = new Worker("assets/wasm/talker.js")
  talker.onmessage = onMessage
}