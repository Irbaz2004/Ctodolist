import React, { useEffect, useState } from 'react';
import { auth, db } from '../Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Todo() {
  const [user, setUser] = useState(null);
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'todos'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(items);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTodo = async () => {
    if (!todo.trim()) return;

    try {
      await addDoc(collection(db, 'todos'), {
        text: todo,
        uid: user.uid,
        completed: false,
        createdAt: new Date()
      });
      setTodo('');
    } catch (error) {
      console.error('Error adding todo: ', error);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const todoRef = doc(db, 'todos', id);
    try {
      await updateDoc(todoRef, { completed: !currentStatus });
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSaveEdit = async (id) => {
    const todoRef = doc(db, 'todos', id);
    try {
      await updateDoc(todoRef, { text: editText });
      setEditId(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing todo: ', error);
    }
  };

  const handleDelete = async (id) => {
    const todoRef = doc(db, 'todos', id);
    try {
      await deleteDoc(todoRef);
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/')
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!user) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography variant="h5" align="center">
          Please login to view your todos.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.email}
      </Typography>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ mb: 3 }}
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
      >
        Logout
      </Button>

      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="New Todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleAddTodo}
          fullWidth
        >
          Add Todo
        </Button>
      </Paper>

      <List>
        {todos.map((item) => (
          <ListItem key={item.id} divider>
            <Checkbox
              checked={item.completed}
              onChange={() => handleToggleComplete(item.id, item.completed)}
            />
            {editId === item.id ? (
              <TextField
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                fullWidth
                sx={{ mr: 2 }}
              />
            ) : (
              <ListItemText
                primary={item.text}
                style={{
                  textDecoration: item.completed ? 'line-through' : 'none'
                }}
              />
            )}
            <ListItemSecondaryAction>
              {editId === item.id ? (
                <IconButton onClick={() => handleSaveEdit(item.id)}>
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton onClick={() => handleEdit(item.id, item.text)}>
                  <EditIcon />
                </IconButton>
              )}
              <IconButton onClick={() => handleDelete(item.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
