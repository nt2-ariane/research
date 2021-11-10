require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
var errorhandler = require('errorhandler')


const fileUpload = require('express-fileupload');
const fs = require('fs');

//***SÉCURITÉ***
//HELMET
// -> Helmet aide à protéger l'application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
var helmet = require('helmet');
app.use(helmet());

//Désactivez au minimum l’en-tête X-Powered-By
app.disable('x-powered-by');

//N’utilisez pas de nom de cookie de session par défaut
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 's3Cur3',
    name: 'sessionId',
    resave: true,
    saveUninitialized: true
})
);

app.use(express.static('public')); //to access the files in public folder

app.use(cors({
    origin: ['http://researchexhibition.org', 'https://researchexhibition.org', 'http://www.researchexhibition.org'],
    default: 'https://researchexhibition.org'
}));
app.use(fileUpload());

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler({ log: errorNotification }))
}
function errorNotification(err, str, req) {
    var title = 'Error in ' + req.method + ' ' + req.url

    notifier.notify({
        title: title,
        message: str
    })
}

//Site
app.get('/', function (req, res) {
    res.send('Vous êtes à l\'accueil de research, que puis-je pour vous ?');
})
app.get('/file/:name', (req, res) => {
    const path = './public/' + req.params.name
    console.log(path)

    res.download(path, req.params.name, (err) => {
        if (err) {
            console.log(err)
            return
        } else {
            //do something
        }
    })
})
app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    // accessing the file
    const myFile = req.files.file;
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({ name: myFile.name, path: `/file/${myFile.name}` });
    });
})
//Connection à la base de donnée

try {
    //mongoose.connect(process.env.DATABASE_URL)
    mongoose.connect('mongodb://mongodb:27017/research',
			{ useNewUrlParser: true });
    const db = mongoose.connection
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('connected to database'))
} catch (error) {
    console.log(error)
}

app.use(express.json())


//API
const usersRouter = require('./routes/users')
app.use('/user', usersRouter)

const fichesRouter = require('./routes/fiches')
app.use('/api', fichesRouter)

const keywordsRouter = require('./routes/keywords')
app.use('/api', keywordsRouter)

const creditsRouter = require('./routes/credit')
app.use('/api', creditsRouter)

const textRouter = require('./routes/texts')
app.use('/api', textRouter)

const mediaRouter = require('./routes/media')
app.use('/api', mediaRouter)

//Gestionnaire de mdp
// Know IP
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
})

app.listen(80, () => console.log('server started')).on('error', function (err) { console.log(err) });
