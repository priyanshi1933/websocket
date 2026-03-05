import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages,setMessages]=useState([]);
  console.log(messages);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message,room});
    setMessage("");
  };
  useEffect(() => {

    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages)=>[...messages,data]);
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
     <Box sx={{height:200}}/>
      
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>

      

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
      <Stack>
        {
          messages.map((m,i)=>(
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  );
};

export default App;
