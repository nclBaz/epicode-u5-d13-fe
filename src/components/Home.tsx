import { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  ListGroup,
  Button,
} from "react-bootstrap"

import { io } from "socket.io-client"

// 1) Every time we refresh the page, the clients connect to the server
// 2) If this connection established correctly, the server will EMIT to us a special event
// 3) If we want to "react" to that event --> we shall LISTEN to that by using socket.on("event")
// 4) Once that this "welcome" event is received by the client --> submit username
// 5) We submit our username to the server by emitting an event called "setUsername"

const socket = io("http://localhost:3001", { transports: ["websocket"] }) // if you don't specify websocket here, socketio will try to use Polling (old technique) which is going to give you CORS troubles

const Home = () => {
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // this code will be executed only once!
    // we need to set up the event listeners just once!
    socket.on("welcome", welcomeMessage => {
      console.log(welcomeMessage)
    })
  })

  const handleUsernameSubmit = () => {
    // here we are sending the username to the server by EMITTING an event of type "setUsername" since this is the name of the event the server is already listening for
    socket.emit("setUsername", { username })
    // after sending username to the server, if everything goes well the server will emit us back another event
    // this event is called "loggedIn" <-- this concludes the login process and puts us in the online users list
    // with the "loggedIn" event the server will communicate the list of the current connected users
  }

  return (
    <Container fluid>
      <Row style={{ height: "95vh" }} className="my-3">
        <Col md={9} className="d-flex flex-column justify-content-between">
          {/* LEFT COLUMN */}
          {/* TOP AREA: USERNAME INPUT FIELD */}
          {/* {!loggedIn && ( */}
          <Form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormControl
              placeholder="Set your username here"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form>
          {/* )} */}
          {/* MIDDLE AREA: CHAT HISTORY */}
          <ListGroup></ListGroup>
          {/* BOTTOM AREA: NEW MESSAGE */}
          <Form
            onSubmit={e => {
              e.preventDefault()
            }}
          >
            <FormControl
              placeholder="Write your message here"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </Form>
        </Col>
        <Col md={3}>
          {/* ONLINE USERS SECTION */}
          <div className="mb-3">Connected users:</div>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
