
const express = require('express');
const cors = require('cors');
const db = require('./database/database');
const config = require('./config/config');
const app = express();
const PORT = config.port;
// const db = require('./database/databae').db;
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
//     }
// );

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api', productRoutes);
app.use('/api', authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
