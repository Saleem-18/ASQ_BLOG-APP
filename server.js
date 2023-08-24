const express = require('express');
const cors = require('cors');
const morgan= require('morgan');
const colors= require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');



//env config
dotenv.config();

//routes import
const userRoutes =require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

//MongoDB Connection
connectDB();

//rest objects
const  app = express();

//middlewares
app.use(cors()); //allow cross origin requests
app.use(express.json());
app.use(morgan('dev'));


//static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

//routes
// app.get('/',(req,res)=>{
//     res.status(200).send({
//         "message": "Node server"
//     })
// });
 app.use("/api/v1/user",userRoutes)
 app.use("/api/v1/blog",blogRoutes)

 app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });


//port
const PORT = process.env.PORT || 8080

//listen
app.listen(PORT, () => {
    console.log(`server running on ${process.env.DEV_MODE} mode, port no ${PORT}`.bgCyan.white);
});


