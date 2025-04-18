//server.js
const express = require("express");
const path = require('path');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');

const fs = require('fs'); 
const session = require('express-session');


app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret: 'adopt-secret-key', 
    resave: false,
    saveUninitialized: true
  }));

app.set('view engine','html');
app.engine('html', ejs.renderFile);
app.set('views',path.join(__dirname,'views'));

const usersFile = path.join(__dirname,'login.txt');
const petsFile = path.join(__dirname,'pets.txt');

app.use((req, res, next) => {
    res.locals.username = req.session.username || null;
    next();
  });
  

app.get('/',(req,res)=> {
    const message = req.query.message || '';
    res.render('Homepage',{title:'Adopt A Cat/Dog - Home',message ,username: req.session.username || null})});

app.get('/login',(req,res)=>{
    if (req.session.username) {
        return res.render('login', {
          title: 'Login',
          username: req.session.username,
          error: '⚠️ You are already logged in. Please log out before logging in with another account.'
        });
      }
    res.render('login',{title:'login',error:'',
        username: req.session.username || null});
})
app.post('/login',(req,res)   =>  {
   if(req.session.username){
    return res.render('login',{
        title:'login',
        username: req.session.username,
        error:'⚠️ You are already logged in. Please log out before logging in with another account.'
    });
}
    const { username, password } = req.body;
    const data = fs.readFileSync(usersFile, 'utf-8');
    const lines = data.trim().split('\n');
    const match = lines.find(line => {
    const [u, p] = line.trim().split(':');
    return u === username && p === password;
  });
    if(match){
        req.session.username = username;
        res.redirect('/giveaway');
    }else{
        res.render('login',{title:'login',username: null,error:'Invalid username or password'});
    };
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Logout failed.');
    res.redirect('/logout-confirmed');
  });
});

app.get('/logout-confirmed', (req, res) => {
  res.render('logout', { title: 'Logged Out' });
});



app.post('/submitPet',(req,res)=>{
    if(!req.session.username)return res.redirect('login');
    const { username,petType,breed,age,gender,ownername,owneremail,comments}  = req.body;
    const getsAlong = (req.body.getsAlong || []).join(',');
    let petId = 1 ;
    if(fs.existsSync(petsFile)){
        const content = fs.readFileSync(petsFile,'utf-8');
        const lines = content.trim().split('\n');
        petId=lines.length + 1 ;
    }

    const entry = `${petId}:${req.session.username}:${petType}:${breed}:${age}:${gender}:${getsAlong}:${ownername}:${owneremail}:${comments}\n`;
    fs.appendFileSync('pets.txt',entry);
    res.render('success');

});

app.get('/pets', (req, res) => {
  res.render('pets', {
    title: 'Available Pets',
    results: [],
    username: req.session.username || null
  });
});

app.get('/find', (req, res) => {
  res.render('find', {
    title: 'Find a Dog/Cat',
    username: req.session.username || null
  });
});

app.post('/find', (req, res) => {
  const { petType, breed, age, gender, compatibility } = req.body;
  const selectedCompat = Array.isArray(compatibility)
    ? compatibility
    : [compatibility];

  // 1. 预设的四条示例
  const defaultPets = [
    { id:1, type:'dog', breed:'breed1', age:'adult', gender:'male',
      compatibility:['otherdogs','smallchildren'], image:'/img/pet1.jpg', name:'Husky' },
    { id:2, type:'cat', breed:'breed2', age:'adult', gender:'female',
      compatibility:['otherdogs','othercats','smallchildren'], image:'/img/pet2.jpg', name:'British Shorthair' },
    { id:3, type:'cat', breed:'breed3', age:'adult', gender:'male',
      compatibility:['otherdogs','othercats','smallchildren'], image:'/img/pet3.jpg', name:'Siamese' },
    { id:4, type:'cat', breed:'breed4', age:'adult', gender:'male',
      compatibility:['otherdogs','othercats','smallchildren'], image:'/img/pet4.jpg', name:'Mixed Breed' }
  ];

  // 2. 从 pets.txt 读取动态数据
  let dynamicPets = [];
  if (fs.existsSync(petsFile)) {
    const lines = fs.readFileSync(petsFile, 'utf-8')
                     .trim()
                     .split('\n')
                     .filter(Boolean);
    dynamicPets = lines.map(line => {
      const [id, owner, type, breed, age, gender, getsAlong] = line.split(':');
      return {
        id:            Number(id),
        type,
        breed,
        age,
        gender,
        compatibility: getsAlong ? getsAlong.split(',') : [],
        image:         `/img/pet${id}.jpg`,
        name:          breed
      };
    });
  }

  // 3. 合并所有宠物
  const allPets = defaultPets.concat(dynamicPets);

  // 4. 过滤
  const matched = allPets.filter(p =>
       (petType === 'any'   || p.type   === petType)
    && (breed   === 'any'   || p.breed  === breed)
    && (age     === 'any'   || p.age    === age)
    && (gender  === 'any'   || p.gender === gender)
    && selectedCompat.every(c => p.compatibility.includes(c))
  );

  // 5. 渲染模板
  res.render('find', {
    title:    'Find a Dog/Cat',
    username: req.session.username || null,
    error:    matched.length ? null : 'No matching pets found.',
    results:  matched
  });
});


app.get('/create-account', (req, res) => {
    res.render('createAccount', {
      title: 'Create Account',
      username: req.session.username || null,
      error: '',
      success: '',
    });
  });
app.post('/create-account',(req,res) =>{
   if(req.session.username){
    return res.render('createAccount',{title:'Create Account',
        username:req.session.username,
        error:'You are already logged in. Please log out before creating a new account.',
        success:''});
    
   }
    const {username,password} = req.body;

    const usernameRegex=/^[a-zA-Z0-9]+$/;
    const passwordregex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

    if(!usernameRegex.test(username) || !passwordregex.test(password)){
        return res.render('createAccount',{
            title:'Create Account',
            error : 'Invalid username or password format.',
            success:''
        });
    }
    const data =fs.existsSync(usersFile) ? fs.readFileSync(usersFile,'utf-8') :'';
    const lines = data.trim().split('\n');
    const exists = lines.find(line =>line.split(':')[0] ===username) ;

    if(exists){
        return res.render('createAccount',{
            title:'Create Account',
            username: req.session.username || null,
            error:'Username already exists',
            success:''
        });
    }
    fs.appendFileSync(usersFile,`${username}:${password}\n`);
    res.render('createAccount',{
        title:'Create Account',
        username: req.session.username || null,
        error:'',
        success:'Account created successfully! You can now log in.'
    });
});


  
  app.get('/giveaway', (req, res) => {
    if (!req.session.username) return res.redirect('/login');
    
    res.render('giveaway', {
      title: 'Have a pet to Give away',
      username: req.session.username
    });
  });
  
    

app.get('/dogcare',(req,res) => {res.render('dogcare',{title:'Dog care - Adopt A Cat/Dog',
    username: req.session.username || null})});
app.get('/catcare',(req,res) =>{ res.render('catcare',{title:'Cat care - Adopt A Cat/Dog',
    username: req.session.username || null})});
app.get('/contact',(req,res) => {res.render('contact',{title:'Contact us',
    username: req.session.username || null})});
app.get('/pets',(req,res) => {res.render('pets',{title:'Browse Available Pets',
    username: req.session.username || null})});
app.get('/privacy',(req,res) => {res.render('privacy',{title :'Privacy Statement',
    username: req.session.username || null})});

    module.exports = (req, res) => {
      return app(req, res);
    };
