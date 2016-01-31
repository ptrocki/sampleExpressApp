var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var moment = require('moment');

var app = express();
app.locals.moment = require('moment');
var rootURL = 'http://localhost:3000/';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

var users = function(req, res) {
    connection.query('SELECT * FROM mydb.osoba', function(err, rows) {
        if (err) throw err;

        res.render('users', {
            users: rows
        });
    });
};

var books = function(req, res) {
    connection.query('SELECT * FROM mydb.egzemplarz WHERE format IS NULL and ilosc>0', function(err, rows) {
        if (err) throw err;
        res.render('books', {
            books: rows
        });
    });
};
var audiobooks = function(req, res) {
    connection.query('SELECT * FROM mydb.egzemplarz WHERE format IS NOT NULL and ilosc>0', function(err, rows) {
        if (err) throw err;
        res.render('audiobooks', {
            audiobooks: rows
        });
    });
};
var user = function(req, res) {
    connection.query('SELECT * FROM mydb.osoba WHERE idosoba=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('user', {
            user: rows[0]
        });
    });
};

var index = function(req, res, next) {
    res.render('index', {
        title: 'Biblioteka'
    });
};

var shoppingCart = function(req, res) {
    connection.query('SELECT * FROM mydb.koszyk k JOIN mydb.osoba o on k.osoba_idosoba = o.idosoba JOIN mydb.egzemplarz e on k.egzemplarz_idegzemplarz=e.idegzemplarz', function(err, rows) {
        if (err) throw err;
        //console.log('The solution is: ', rows[0]);
        res.render('shopping_cart', {
            shoppingCartItems: rows
        });
    });
};

var adduser = function(req, res, next) {
    res.render('adduser', {
        title: 'Biblioteka'
    });
};

var addnewuser = function(req, res) {
    //console.log('Username: ' + req.body.name);
    //console.log('Surname: ' + req.body.surname);
    //console.log('Department: ' + req.body.department);
    connection.query('INSERT INTO mydb.osoba (`idosoba`, `imie`, `nazwisko`, `wydzial`) VALUES (NULL,' + "'" + req.body.name + "'" + ',' + "'" + req.body.surname + "'" + ',' + "'" + req.body.department + "'" + ')', function(err, rows) {
        if (err) throw err;
        res.writeHead(302, {
            'Location': 'http://localhost:3000/users'
        });
        res.end();
    });
}

var modifyUserSite = function(req, res, next) {
    connection.query('SELECT * FROM mydb.osoba WHERE idosoba=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('modifyuser', {
            user: rows[0]
        });
    });
}




/*This is for each separated field but I have to make a simple connection so I decided to update all filed*/
// var modifyUser = function(req, res) {
//     var queryBegin = 'UPDATE mydb.osoba SET ';
//     var queryEnd = " WHERE `osoba`.`idosoba` =" + req.query.id;
//     var name = req.body.name;
//     var surname = req.body.surname;
//     var department = req.body.department;

//     if (name) {
//         connection.query(queryBegin + "`imie` = '" + name + "'" + queryEnd, function(err, rows) {
//             if (err) throw err;
//             console.log(queryBegin + "`imie` = '" + name + "'" + queryEnd);
//         });
//     }
//     if (surname) {
//         connection.query(queryBegin + "`nazwisko` = '" + surname + "'" + queryEnd, function(err, rows) {
//             if (err) throw err;
//         });
//     }
//     if (department > 0) {
//         connection.query(queryBegin + "`wydzial` = '" + department + "'" + queryEnd, function(err, rows) {
//             if (err) throw err;
//         });
//     }
//     res.writeHead(302, {
//         'Location': 'http://localhost:3000/users'
//     });
//     res.end();
// }
var modifyUser = function(req, res) {
    var queryBegin = 'UPDATE mydb.osoba SET ';
    var queryEnd = " WHERE `osoba`.`idosoba` =" + req.query.id;
    var name = req.body.name;
    var surname = req.body.surname;
    var department = req.body.department;

    if (!name || !surname || !department) {
        res.render('error', {
            message: err.message,
            error: err
        });
    } else {
        connection.query(queryBegin + "`imie` = '" + name + "'" + ",`nazwisko` = '" + surname + "'" +
            ",`wydzial` = '" + department + "'" + queryEnd,
            function(err, rows) {
                if (err) throw err;
                console.log(queryBegin + "`imie` = '" + name + "'" + queryEnd);
            });
    }
    res.writeHead(302, {
        'Location': 'http://localhost:3000/users'
    });
    res.end();
}

var deleteUserSite = function(req, res) {
    connection.query('SELECT * FROM mydb.osoba WHERE idosoba=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('deleteUser', {
            user: rows[0]
        });
    });
}

var deleteUser = function(req, res) {
    console.log(req.query.id);
    connection.query('Delete FROM mydb.osoba WHERE osoba.idosoba = ' + req.query.id, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/users'
    });
    res.end();
}

var addBookSite = function(req, res) {
    res.render('addBook', {
        title: 'Biblioteka'
    });
}

var addBook = function(req, res) {
    var query = 'INSERT INTO mydb.egzemplarz (`idegzemplarz`, `autor`, `tytul`, `wydawnictwo`, `rok_wydania`, `cena`, `format`, `ilosc`) VALUES (NULL,' + "'" + req.body.author + "'" + ',' + "'" + req.body.title + "'" + ',' + "'" + req.body.publisher + "'" + ',' + "'" + req.body.year + "'" + ',' + "'" + req.body.price + "'" + ',' + "NULL" + ',' + "'" + req.body.count + "'" + ')';
    connection.query(query, function(err, rows) {
        if (err) throw err;
        res.writeHead(302, {
            'Location': 'http://localhost:3000/books'
        });
        res.end();
    });
}
var modifyBookSite = function(req, res) {
    connection.query('SELECT * FROM mydb.egzemplarz WHERE idegzemplarz=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('modifyBook', {
            book: rows[0]
        });
    });
}

var modifyBook = function(req, res) {
    var queryBegin = 'UPDATE mydb.egzemplarz SET ';
    var queryEnd = " WHERE `egzemplarz`.`idegzemplarz` =" + req.query.id;
    var author = req.body.author;
    var title = req.body.title;
    var publisher = req.body.publisher;
    var year = req.body.year;
    var price = req.body.price;
    var count = req.body.count;
    connection.query(queryBegin + "`autor` = '" + author + "', `tytul`='" + title + "',`wydawnictwo`='" + publisher + "', `rok_wydania` ='" + year + "',`cena`='" + price + "', `format`=NULL, `ilosc`='" + count + "'" + queryEnd, function(err, rows) {
        if (err) throw err;
        console.log('if Username: ');
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/books'
    });
    res.end();
}

var deleteBookSite = function(req, res) {
    connection.query('SELECT * FROM mydb.egzemplarz WHERE idegzemplarz=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('deleteBook', {
            book: rows[0]
        });
    });
}

var deleteBook = function(req, res) {
    connection.query('Delete FROM mydb.egzemplarz WHERE egzemplarz.idegzemplarz=' + req.query.id, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/books'
    });
    res.end();
}

var addAudioSite = function(req, res) {
    res.render('addAudio', {
        title: 'Biblioteka'
    });
}

var addAudio = function(req, res) {
    var query = 'INSERT INTO mydb.egzemplarz (`idegzemplarz`, `autor`, `tytul`, `wydawnictwo`, `rok_wydania`, `cena`, `format`, `ilosc`) VALUES (NULL,' + "'" + req.body.author + "'" + ',' + "'" + req.body.title + "'" + ',' + "'" + req.body.publisher + "'" + ',' + "'" + req.body.year + "'" + ',' + "'" + req.body.price + "'" + ',' + "'" + req.body.format + "'" + ',' + "'" + req.body.count + "'" + ')';
    connection.query(query, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/audiobooks'
    });
    res.end();
}
var modifyAudioSite = function(req, res) {
    connection.query('SELECT * FROM mydb.egzemplarz WHERE idegzemplarz=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('modifyAudio', {
            audiobook: rows[0]
        });
    });
}

var modifyAudio = function(req, res) {
    var queryBegin = 'UPDATE mydb.egzemplarz SET ';
    var queryEnd = " WHERE `egzemplarz`.`idegzemplarz` =" + req.query.id;
    var author = req.body.author;
    var title = req.body.title;
    var publisher = req.body.publisher;
    var year = req.body.year;
    var price = req.body.price;
    var format = req.body.format;
    var count = req.body.count;
    console.log(queryBegin + "`autor` = '" + author + "', `tytul`='" + title + "',`wydawnictwo`='" + publisher + "', `rok_wydania` ='" + year + "',`cena`='" + price + "', `format`='" + format + "', `ilosc`='" + count + "'" + queryEnd);
    connection.query(queryBegin + "`autor` = '" + author + "', `tytul`='" + title + "',`wydawnictwo`='" + publisher + "', `rok_wydania` ='" + year + "',`cena`='" + price + "', `format`='" + format + "', `ilosc`='" + count + "'" + queryEnd, function(err, rows) {
        if (err) throw err;

    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/audiobooks'
    });
    res.end();
}
var deleteAudioSite = function(req, res) {
    connection.query('SELECT * FROM mydb.egzemplarz WHERE idegzemplarz=?', req.query.id, function(err, rows) {
        if (err) throw err;
        res.render('deleteAudio', {
            audiobook: rows[0]
        });
    });
}

var deleteAudio = function(req, res) {
    connection.query('Delete FROM mydb.egzemplarz WHERE egzemplarz.idegzemplarz=' + req.query.id, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/audiobooks'
    });
    res.end();
}

var deleteOrderSite = function(req, res, next) {
    connection.query('SELECT * FROM mydb.koszyk WHERE idkoszyk=?', req.query.id, function(err, rows) {
        if (err) throw err;
        console.log('deleteOrderSite', rows[0]);
        res.render('deleteOrder', {
            cart: rows[0]
        });
    });
}
var deleteOrder = function(req, res) {
    connection.query('Delete FROM mydb.koszyk WHERE koszyk.idkoszyk=' + req.query.id, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/shopping_cart'
    });
    res.end();
}

var reservationSite = function(req, res) {

    connection.query('SELECT * FROM mydb.osoba WHERE osoba.ilosc_books < 3', function(err, rows) {
        if (err) throw err;

        res.render('reservation', {
            users: rows
        });
    });
}

var reservation = function(req, res) {
    var begin = moment(new Date).format('YYYY-MM-DD');
    var end = moment(new Date).add(14, 'days').format('YYYY-MM-DD')
    connection.query("INSERT INTO mydb.rezerwacja (`idrezerwacja`, `poczatek`," + "`koniec`,`osoba_idosoba`,`egzemplarz_idegzemplarz`) VALUES (NULL, '" + begin + "', '" + end + "', '" + req.body.user + "', '" + req.query.id + "')", function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/books'
    });
    res.end();
}
var buyBookSite = function(req, res) {

    connection.query('SELECT * FROM mydb.osoba ', function(err, rows) {
        if (err) throw err;
        res.render('buyBook', {
            users: rows
        });
    });
}
var buyBook = function(req, res) {
    connection.query("INSERT INTO mydb.koszyk (`idkoszyk`, `osoba_idosoba`, `egzemplarz_idegzemplarz`) VALUES (NULL, '" + user.idosoba + "', '" + req.query.id + "')", function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/books'
    });
    res.end();
}

var reservationList = function(req, res) {
    connection.query('SELECT * FROM mydb.rezerwacja r JOIN mydb.osoba o on r.osoba_idosoba = o.idosoba JOIN mydb.egzemplarz e on r.egzemplarz_idegzemplarz=e.idegzemplarz', function(err, rows) {
        if (err) throw err;

        res.render('reservationList', {
            orders: rows
        });
    });
}
var returnBookSite = function(req, res) {
    res.render('deletePunish', {});
}

var returnBook = function(req, res) {
    connection.query('Delete FROM mydb.rezerwacja WHERE idrezerwacja =' + req.query.id, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/reservationList'
    });
    res.end();
}

var punishSite = function(req, res, next) {
    connection.query('SELECT * FROM mydb.rezerwacja r JOIN mydb.osoba o ON o.idosoba = r.osoba_idosoba AND CURDATE() > r.koniec JOIN mydb.egzemplarz e on e.idegzemplarz = r.egzemplarz_idegzemplarz', req.query.id, function(err, rows) {
        if (err) throw err;
        console.log('punish', rows[0]);
        res.render('punishment', {
            punishments: rows
        });
    });
}

var deletePunishSite = function(req, res) {
    res.render('deletePunish', {});
}

var deletePunish = function(req,res){
    connection.query('Delete FROM mydb.rezerwacja WHERE idrezerwacja =' + req.query.id, function(err, rows) {
        if (err) throw err;
    });
    res.writeHead(302, {
        'Location': 'http://localhost:3000/punishment'
    });
    res.end();
}
//Routing
//main
app.get('/', index);
//List of user
app.get('/user', user);
app.get('/users', users);
app.get('/adduser', adduser);
app.post('/adduser', addnewuser);

app.get('/modifyuser', modifyUserSite)
app.post('/modifyuser', modifyUser)

app.get('/deleteUser', deleteUserSite);
app.post('/deleteUser', deleteUser);

//List of books
app.get('/books', books);

app.get('/addBook', addBookSite);
app.post('/addBook', addBook);

app.get('/modifyBook', modifyBookSite);
app.post('/modifyBook', modifyBook);

app.get('/deleteBook', deleteBookSite);
app.post('/deleteBook', deleteBook);

//List of audiobooks
app.get('/audiobooks', audiobooks);

app.get('/addAudio', addAudioSite);
app.post('/addAudio', addAudio);

app.get('/modifyAudio', modifyAudioSite);
app.post('/modifyAudio', modifyAudio);

app.get('/deleteAudio', deleteAudioSite);
app.post('/deleteAudio', deleteAudio);

//shopping cart
app.get('/shopping_cart', shoppingCart);
app.get('/deleteOrder', deleteOrderSite);
app.post('/deleteOrder', deleteOrder);

//reservation
app.get('/reservation', reservationSite);
app.post('/reservation', reservation);

//buy book
app.get('/buyBook', buyBookSite);
app.post('/buyBook', buyBook);

//reservation List
app.get('/reservationList', reservationList);

app.get('/returnBook', returnBookSite);
app.post('/returnBook', returnBook);

//punisher
app.get('/punishment', punishSite);
app.get('/deletePunish',deletePunishSite);
app.post('/deletePunish',deletePunish)

// For debug
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
