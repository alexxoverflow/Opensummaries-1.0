const express= require('express');  // Server express
const app= express();
const url= require('url');
const session= require('express-session');  // express-session, needed to memorise the user session
const oneDay = 1000 * 60 * 60 * 24; // Converting 24h in milliseconds
const fs= require('fs');
const { PDFDocument, StandardFonts } = require("pdf-lib");
// express-fileupload, needed to pass a file through a form
const fileUpload = require('express-fileupload');
const notifier = require('node-notifier');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Daniele:lolwut200@clusterdiprova.ebwcmtr.mongodb.net/?retryWrites=true&w=majority";
const client= new MongoClient(uri);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(fileUpload());
/* Setting the 'cookie' object for user session */
const cookie= {path: "/", httpOnly: true, secure: false, maxAge: oneDay};
/* Creating the 'session' object */
app.use(session({secret: "5V2GIZWQWzw7IseHfUL97lAJ3", saveUnitialized: 'true', resave: 'false', cookie}));


app.get('/', function(req, res) {
    if(!req.session.user)
        res.redirect('/login');
    res.redirect('/home');
});

app.get('/login', function(req, res) {
    if(req.session.user)
    {
        res.redirect('/home');
    }
    res.sendFile("login.html", {root: __dirname + "/public"});
});

app.post("/login", async function (req, res) {
    const url= "https://api.uniparthenope.it/UniparthenopeApp/v1/login";  // URL API Uniparthenope
    const username= req.body.cf;  // Getting data from the input field named 'cf'
    const password= req.body.pwd; // Getting data from the input field named 'pwd'
    // Creating a string using the credentials (required to access to the api)
    let data= username + ":" + password;
    /* Creating a 'header' object, by setting it with the type of authorization (basic) and converting in Base64
    the previous string */
    let headers= new Headers();
    headers.append('Authorization', 'Basic ' + Buffer.from(data).toString('base64'));
    headers.append('Content-Type', 'application/json');
    // Getting file from API
    const response= await fetch(url, {method: 'GET', headers: headers});
    // Converting the result in json
    var json= await response.json();
    name= JSON.parse(JSON.stringify(json.user["firstName"]));
    surname= JSON.parse(JSON.stringify(json.user["lastName"]));
    if(response.status === 401)   // If error 401 occurs...
    {
        // then credentials are incorrect
        notifier.notify({
            title: 'Attenzione',
            message: 'Credenziali incorrette! Riprova',
            icon: __dirname + '/public/images/icons8-error-48.png',
        });
        res.redirect('/login');
    }
    else if(response.ok) // response.ok is true when the state code is between 200-299
    {
        // Creating 'user' object with the previously extracted data
        var user= {username: username, password: password, name: name, surname: surname};
        req.session.user= user;   // Store the user session and autenticate them
        res.redirect('/home');
    }
});

app.get('/home', function (req, res) {
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    res.sendFile('homepage.html', {root: __dirname + "/public"});
});

app.get('/logout', function(req, res) {
    if(req.session.user)
    {
        req.session.destroy();
        notifier.notify({
            title: 'Info',
            message: 'Disconnessione effettuata!',
            icon: __dirname + '/public/images/icons8-tick-box-80.png'
        });
        res.redirect("http://localhost:3000/login");
    }
    res.redirect("http://localhost:3000/login");
});

app.get('/infoprivacy', function(req, res) {
    res.sendFile('infoprivacy.html', {root: __dirname + "/public"});
});

app.get('/riassunti', function(req, res) {
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    res.sendFile('/riassunti.html', {root: __dirname + "/public"});
});

app.get('/carica', function (req, res) {
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    res.sendFile('carica_summaries.html', {root: __dirname + "/public"});
});

app.post('/carica', async function(req, res) {
    let file= req.files.fileToUpload;
    let name= req.body.summaryTitle;
    let exam= req.body.course;
    let uploadPath= __dirname + "/uploads/" + file.name;
    let date= new Date();
    // Move the uploaded file from the temporary folder to the 'uploads' folder of the server
    file.mv(uploadPath, function(err) {
        if (err)
        {
            notifier.notify({
                title: 'Attenzione',
                message: 'Errore di caricamento. Riprova',
                icon: __dirname + '/public/images/icons8-error-48.png'
            });
            res.redirect('/carica');
        }
    });
    // Signing digitally the document
    const newPdfDoc = await PDFDocument.create();
    await fs.readFile(uploadPath, async function(err, data) {
        const existingPDFDoc= await PDFDocument.load(data);
        const copiedPages = await newPdfDoc.copyPages(existingPDFDoc, existingPDFDoc.getPageIndices());
        copiedPages.forEach(page => newPdfDoc.addPage(page));
        const page = newPdfDoc.addPage();
        const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText('Autore documento\nNome: ' + req.session.user.name + '\nCognome: ' + req.session.user.surname + '\nCF: ' + req.session.user.username + '\nData caricamento: ' + date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear(), { x: 10, y: page.getHeight() - 50, font, size: 12 });
        const newPdf= await newPdfDoc.save();
        fs.writeFileSync(uploadPath, newPdf);   // Saving the new document
        await client.connect(); // Connecting to the database
        console.log('Connessione effettuata');
        const database= client.db('ClusterDiProva');    // Choosing database
        /* Inserting data in the collection which name is the same of the exam */
        database.collection(exam).insertOne({nome: name, esame: exam, autore: req.session.user.name + " " + req.session.user.surname, rating: 0, nomeFile: file.name});
        console.log('Dati caricati');
        setTimeout(() => {client.close()}, 1500);
        console.log('Connessione chiusa');
        notifier.notify({
            title: 'Info',
            message: 'File caricato!',
            icon: __dirname + '/public/images/icons8-tick-box-80.png'
        });
        res.redirect('/carica');
    });
});

app.get('/IAnno', function(req, res) {
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    res.sendFile('c1anno.html', {root: __dirname + '/public'});
});

app.get('/IIAnno', function(req, res) {
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    res.sendFile('c2anno.html', {root: __dirname + '/public'});
});

app.get('/IIIAnno', function(req, res) {
    if(!req.session.user)
    {
        res.redirect('/login');
    }
    res.sendFile('c3anno.html', {root: __dirname + '/public'});
});

app.get('/riassunti/architettura', async function(req, res) {
    await client.connect();
    console.log('Connessione effettuata');
    const database= client.db('ClusterDiProva');    // Choose database
    /* Getting all data from the collection 'architettura' as an array */
    const result= await database.collection('architettura').find().toArray();
    console.log('Dati recuperati');
    setTimeout(() => {client.close()}, 1500);
    console.log('Connessione chiusa');
    res.json(result);   // Sending back to client the data
});

app.get('/riassunti/matematica1', async function(req, res) {
    await client.connect();
    console.log('Connessione effettuata');
    const database= client.db('ClusterDiProva');
    /* Getting all data from the collection 'matematica1' as an array */
    const result= await database.collection('matematica1').find().toArray();
    console.log('Dati recuperati');
    setTimeout(() => {client.close()}, 1500);
    console.log('Connessione chiusa');
    res.json(result);
});

app.get('/riassunti/programmazione1', async function(req, res) {
    await client.connect();
    console.log('Connessione effettuata');
    const database= client.db('ClusterDiProva');
    /* Getting all data from the collection 'programmazione1' as an array */
    const result= await database.collection('programmazione1').find().toArray();
    console.log('Dati recuperati');
    setTimeout(() => {client.close()}, 1500);
    console.log('Connessione chiusa');
    res.json(result);
});

app.get('/riassunti/programmazione2', async function(req, res) {
    await client.connect();
    console.log('Connessione effettuata');
    const database= client.db('ClusterDiProva');
    /* Getting all data from the collection 'programmazione2' as an array */
    const result= await database.collection('programmazione2').find().toArray();
    console.log('Dati recuperati');
    setTimeout(() => {client.close()}, 1500);
    console.log('Connessione chiusa');
    res.json(result);
});

app.get('/riassunti/fisica', async function(req, res) {
    await client.connect();
    console.log('Connessione effettuata');
    const database= client.db('ClusterDiProva');
    /* Getting all data from the collection 'fisica' as an array */
    const result= await database.collection('fisica').find().toArray();
    console.log('Dati recuperati');
    setTimeout(() => {client.close()}, 1500);
    console.log('Connessione chiusa');
    res.json(result);
});

app.get('/riassunti/inglese', async function(req, res) {
    await client.connect();
    console.log('Connessione effettuata');
    const database= client.db('ClusterDiProva');
    /* Getting all data from the collection 'inglese' as an array */
    const result= await database.collection('inglese').find().toArray();
    console.log('Dati recuperati');
    setTimeout(() => {client.close()}, 1500);
    console.log('Connessione chiusa');
    res.json(result);
});

app.get("/fileDownload", function(req, res) {
    // Extract the file name from the query part of the url
    const queryData= url.parse(req.url, true).query;
    const path= __dirname + "/uploads/" + queryData.name;
    // Download the file
    res.download(path, queryData.name);
});

app.get('*', function (req, res) {
    res.send('<h1>Pagina non trovata!</h1>');
})

app.listen(3000);
console.log("Server in ascolto");
