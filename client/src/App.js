import './App.css';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';
import Chat from './Chat';

const socket = io.connect('http://192.168.0.106:3001')
function App() {
  const [joinStatus, setJoinStatus] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    room_id: ''
  })

  const handelAuthLogin = () => {
    console.log(formData)
    socket.emit('join_room', formData.room_id)
    setJoinStatus(true)
  }

  return (
    <div className="App d-flex justify-content-center align-items-center bg-secondary" style={{ minHeight: '100vh' }}>
      {!joinStatus ?
        <Card style={{ width: '30rem' }} className="p-5 bg-light shadow">

          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="shohan"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" placeholder="room id"
                value={formData.room_id}
                onChange={(event) => setFormData({ ...formData, room_id: event.target.value })}
              />
            </Form.Group>

            <Button variant="primary" onClick={handelAuthLogin}>
              LOGIN
            </Button>
          </Form>
        </Card>
        :

        <Chat userInfo={formData} socket={socket} />
      }

    </div>
  );
}

export default App;
