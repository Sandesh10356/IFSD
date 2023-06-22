const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sandeshahubsc22:sandy123@cluster0.ies233z.mongodb.net/playing?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
  });

  const User = mongoose.model('User', userSchema);

  // Create a document
  const user = new User({
    name: 'John Doe',
    age: 25,
    email: 'john.doe@example.com',
  });

  user.save()
    .then((savedUser) => {
      console.log('User created:', savedUser);

      // Read documents
      return User.find();
    })
    .then((users) => {
      console.log('Users:', users);

      // Find a specific user
      return User.findOne({ name: 'John Doe' });
    })
    .then((user) => {
      console.log('User:', user);

      // Update a document
      return User.findOneAndUpdate(
        { name: 'John Doe' },
        { age: 30 },
        { new: true }
      );
    })
    .then((updatedUser) => {
      console.log('Updated user:', updatedUser);

      // Delete a document
      return User.findOneAndDelete({ name: 'John Doe' });
    })
    .then((deletedUser) => {
      console.log('Deleted user:', deletedUser);

      // Close the database connection
      db.close();
    })
    .catch((err) => {
      console.error(err);
    });
});