import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  rem,
} from '@mantine/core'

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

export function AuthenticationComponent() {
  const { classes } = useStyles()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => emailFieldValidator(value),
      password: (value) => requiredFieldValidator(value),
    },
  })
  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmitForm}>
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
            {...form.getInputProps('email')}
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
  )
}
