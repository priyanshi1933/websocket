import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessages((prev) => [...prev, { text: message, type: "sent" }]);
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, { text: data, type: "received" }]);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />

      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    
      <Stack spacing={2} sx={{ mt: 4 }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: m.type === "sent" ? "flex-end" : "flex-start",
              textAlign: m.type === "sent" ? "right" : "left",
            }}
          >
            <Typography variant="caption" display="block" color="textSecondary">
              {m.type === "sent" ? "Send" : "Receive"}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                bgcolor: m.type === "sent" ? "#1976d2" : "#f5f5f5",
                color: m.type === "sent" ? "white" : "black",
                p: 1,
                borderRadius: 2,
              }}
            >
              {m.text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
