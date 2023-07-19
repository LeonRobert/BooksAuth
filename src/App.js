import React, { useState } from 'react'
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  rem,
} from '@mantine/core'
import './App.css'
import { useForm } from '@mantine/form'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: rem(900),
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(900),
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}))

// Mock-up AUTH service
const AuthService = {
  login(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'user1' && password === 'password1') {
          resolve({ username: 'user1' })
        } else if (username === 'user2' && password === 'password2') {
          resolve({ username: 'user2' })
        } else {
          reject(new Error('Invalid username or password'))
        }
      }, 1000)
    })
  },
}

// Mock-up Booking service
const BookService = {
  getBooks(username) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Read books from JSON file
        fetch('books.json')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch book data')
            }
            return response.json()
          })
          .then((data) => {
            const user = data.users.find((user) => user.username === username)
            if (user) {
              resolve(user.books)
            } else {
              reject(new Error('User not found'))
            }
          })
          .catch((error) => reject(error))
      }, 1000)
    })
  },
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [books, setBooks] = useState([])
  const { classes } = useStyles()

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => requiredFieldValidator(value),
      password: (value) => requiredFieldValidator(value),
    },
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await AuthService.login(
        form.values.username,
        form.values.password
      )
      setLoggedIn(true)
      const userBooks = await BookService.getBooks(user.username)

      setBooks(userBooks)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    form.reset()
    setBooks([])
  }

  return (
    <div className="App">
      <h1>Book App</h1>
      {loggedIn ? (
        <div>
          <h2>Welcome, {form.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                {book.title} - {book.author}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={classes.wrapper}>
          <form onSubmit={handleLogin}>
            <Paper className={classes.form} radius={0} p={30}>
              <Title
                order={2}
                className={classes.title}
                ta="center"
                mt="md"
                mb={50}
              >
                Welcome to the book App!
              </Title>

              <TextInput
                label="Username"
                placeholder="Username"
                autoComplete="username"
                size="md"
                required
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                autoComplete="current-password"
                required
                size="md"
                mt="md"
                {...form.getInputProps('password')}
              />
              <Button type="submit" fullWidth mt="xl" size="md">
                Login
              </Button>
            </Paper>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
