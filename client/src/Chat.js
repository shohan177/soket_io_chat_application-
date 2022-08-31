import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

function Chat({ userInfo, socket }) {
    const [message, setMessage] = useState('');
    const [remotMsg, setRemotMsg] = useState([])
    const handleSendMessage = async () => {
        const messageData = {
            room: userInfo.room_id,
            auth_name: userInfo.name,
            message: message

        }
        if (message !== '') {
            await socket.emit('send_message', messageData)
            setRemotMsg((prv) => {
                return [...prv, messageData]
            })
        }
    }

    useEffect(() => {
        socket.on('recive_message', (data) => {
            setRemotMsg((prv) => {
                return [...prv, data]
            })

        })
    }, [])
    return (
        <div>
            <Card style={{ width: '30rem' }}>
                <Card.Body className='bg-dark m-3' style={{ height: 500, overflowY: 'scroll' }}>


                    {remotMsg && remotMsg.map((item, index) =>
                        <div className={item.auth_name === userInfo.name ? "d-flex justify-content-start" : "d-flex justify-content-end"} key={index}>
                            <div class={item.auth_name === userInfo.name ? "alert alert-warning" : "alert alert-success"} role="alert" style={{ width: '20rem' }}>
                                <Image src='https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png' style={{ height: 50, with: 50 }} />  {item.message}
                            </div>
                        </div>
                    )
                    }

                </Card.Body>
                <Card.Header style={{ display: 'flex', flexDirection: 'row' }} className="p-3">
                    <Form.Control type="text" placeholder="type your text ..." onChange={(e) => setMessage(e.target.value)} />
                    <Button variant="primary" onClick={() => handleSendMessage()}>
                        SEND
                    </Button>
                </Card.Header>
            </Card>
        </div>
    )
}

export default Chat