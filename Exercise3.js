const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'telephone.html'));
});

app.post('/checkPhone',(req,res)=>{
    const {name,phone} = req.body;

    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    let message = '';

       if (phoneRegex.test(phone)) {
        message = `Hello ${name}, your telephone number ${phone} is valid!`;
    } else {
        message = `Hello ${name}, your telephone number ${phone} is not valid! Please use the format ddd-ddd-dddd.`;
     }

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset = "UTF-8">
<title>Phone Check Result </title>
</head>
<body>
<p style = "text-align: center;">${message}</p>
<p style = "text-align: center;"><a href="/">Go back</a></p>
</body>
</html>
    `);

});
app.listen(port,()=>{
    console.log(`Server is running on port ${port}. Access http://localhost:${port}/ to test the fonction !`)
})