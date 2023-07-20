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
export default BookService
