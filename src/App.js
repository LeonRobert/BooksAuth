import React, { useEffect, useState } from 'react'
import {
  Alert,
  Header,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Container,
  createStyles,
  Group,
  ScrollArea,
  Table,
  Loader,
  Skeleton,
} from '@mantine/core'
import './App.css'
import { useForm } from '@mantine/form'

import AuthService from './services/auth'
import BookService from './services/books'

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  logout: {
    justifyContent: 'flex-end',
  },
  table: {
    marginTop: theme.spacing.md,
    overflowX: 'auto',
    backgroundColor: theme.colorScheme === 'light' ? theme.white : theme.black,
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.sm,

    [theme.fn.smallerThan(1100)]: {
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

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
      setLoading(true)
      const userBooks = await BookService.getBooks(username)
      setBooks(userBooks)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const user = await AuthService.login(
        form.values.username,
        form.values.password
      )
      AuthService.setLoggedInUser(user, 3600)
      setLoggedIn(true)
      setUser(user.username)
      await loadBooks(user.username)
    } catch (error) {
      console.log(error)
      setError('Invalid username or password')
    } finally {
      setLoading(false)
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
            <Group ml={50} spacing={5} className={classes.logout}>
              <Button onClick={handleLogout}>Logout</Button>
            </Group>
          </Header>
          <div className={classes.content}>
            <h2>Welcome, {user}!</h2>
            {loading ? (
              <Skeleton
                st
                height={70}
                width="60%"
                radius="xl"
                style={{ display: 'inline-flex' }}
              />
            ) : (
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
            )}
          </div>
        </div>
      ) : (
        <Container size={420} my={80}>
          {loading ? (
            <Loader />
          ) : (
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
              {error && (
                <Alert
                  style={{ display: 'inline-flex', width: 'auto' }}
                  title={error}
                  color="red"
                  mt="lg"
                >
                  Please try again!
                </Alert>
              )}
            </form>
          )}
        </Container>
      )}
    </div>
  )
}

export default App
