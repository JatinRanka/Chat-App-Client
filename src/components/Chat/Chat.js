import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from './../InfoBar/InfoBar.js';
import Input from './../Input/Input.js';
import Messages from './../Messages/Messages.js';
import TextContainer from './../TextContainer/TextContainer.js';

import './Chat.css';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'https://chat-app-jatin.herokuapp.com/';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);
        setName(name);
        setRoom(room);

        socket = io(ENDPOINT);
        socket.emit('join', {name, room}, (error) => {
            if(error){
                alert(error);
            }
        });

        return function cleanup(){
            socket.disconnect();
            socket.off();
        }

    }, [ENDPOINT, location.search])

    useEffect(() => {
        console.log('inef1');
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

    }, [messages]);

    useEffect(() => {
        console.log('inef2');

        socket.on('roomData', (users) => {
            setUsers(users);
        });
    }, [users])



    const sendMessage = (event) => {
        // in reactjs keyPress function refreshes the page
        event.preventDefault();
        console.log("in send msg fnc");

        if(message){
            socket.emit('sendMessage', message, () => setMessage('') );
        }
        
    }

    console.log(message, messages);

    return (
        <div className='outerContainer'>
            <div className="container">    
            <InfoBar room={room} />
            <Messages messages={messages} name={name}/>
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>   
            <TextContainer users={users} />
        </div>
    )
}

export default Chat;