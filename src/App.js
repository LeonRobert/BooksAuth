import React, { useEffect, useState } from 'react'
import {
  Header,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Container,
  createStyles,
  Group,
  Menu,
  ScrollArea,
  Table,
} from '@mantine/core'
import './App.css'
import { useForm } from '@mantine/form'

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    justifyContent: 'flex-end',
  },
  table: {
    marginTop: theme.spacing.md,
    overflowX: 'auto',
    backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.black,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.sm,

    [theme.fn.smallerThan(1100)]: {
      display: 'block',
      overflowX: 'scroll',

      '& tbody tr td': {
        padding: '3px 5px',
      },
    },

    ['tr td']: {
      height: 50,
    },
    ['thead>tr>th']: {
      textAlign: 'center',
    },
  },
  th: {
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px !important`,
  },
  content: {
    padding: '150px 70px 50px 150px',
    minHeight: '100vh',

    [theme.fn.largerThan('sm')]: {
      '&.opened': {
        paddingLeft: '350px',
      },
    },

    [theme.fn.smallerThan('sm')]: {
      paddingLeft: 30,
      paddingRight: 30,
    },

    [theme.fn.smallerThan('xs')]: {
      paddingLeft: theme.spacing.sm,
      paddingRight: theme.spacing.sm,
    },
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
  setLoggedInUser(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user))
  },

  getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser')
    return user ? JSON.parse(user) : null
  },

  clearLoggedInUser() {
    localStorage.removeItem('loggedInUser')
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
  const [user, setUser] = useState('')
  const [books, setBooks] = useState([])
  const { classes } = useStyles()

  useEffect(() => {
    const user = AuthService.getLoggedInUser()
    if (user) {
      setUser(user.username)
      setLoggedIn(true)
      loadBooks(user.username)
    }
  }, [])

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

  const loadBooks = async (username) => {
    try {
      const userBooks = await BookService.getBooks(username)
      setBooks(userBooks)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await AuthService.login(
        form.values.username,
        form.values.password
      )
      AuthService.setLoggedInUser(user)
      setLoggedIn(true)
      loadBooks(user.username)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = () => {
    AuthService.clearLoggedInUser()
    setLoggedIn(false)
    form.reset()
    setBooks([])
  }

  return (
    <div className="App">
      {loggedIn ? (
        <div>
          <Header
            height={70}
            className={classes.header}
            pb={40}
            pt={20}
            zIndex={9999}
            fixed={true}
          >
            <Group ml={50} spacing={5}>
              <Button onClick={handleLogout}>Logout</Button>
            </Group>
          </Header>
          <div className={classes.content}>
            <h2>Welcome, {user}!</h2>

            <ScrollArea
              h={300}
              onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
            >
              <Table className={classes.table} fontSize="xs">
                <thead>
                  <tr>
                    <th className={classes.th}>Title</th>
                    <th className={classes.th}>Author</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <Container size={420} my={80}>
          <form onSubmit={handleLogin}>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
              <Title order={2} ta="center" mt="md" mb={50}>
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
        </Container>
      )}
    </div>
  )
}

export default App
