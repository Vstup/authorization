'use strict';

const http = require('http');
const url = require('url');
const cookie = require('node-cookie');
const fs = require ('fs');
const token = require('./tokenGenerate');
const stat = require('node-static');

const fileServer = new stat.Server( './public', {
    cache: 3600,
    gzip: true
} );


http.createServer(function(req, res){
 console.log(sessions);
 const data = url.parse(req.url, true).query;
 const path = url.parse(req.url, true).pathname;
 console.log(path);
    /*req.addListener( 'end', function () {
        fileServer.serve( req, res );
    } ).resume();*/
 if (path === '' || path === '/'|| path === 'index'|| path === 'index.html'|| path === '/home' ) {
     console.log('checkSess: '+checkSess(req));
     if ( !checkSess(req) ) {
         res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
         res.end(fs.readFileSync('login.html'));

         //}
     } else {
         res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
         res.end(fs.readFileSync('index.html'))
 }}

 if (path ==='/registration'){
     res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
     res.end(fs.readFileSync('registration.html'))
 }

 if (path ==='/login'){
     res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
     res.end(fs.readFileSync('login.html'))
 }

 if (path === '/logout' || path === 'logout') {
     const uname = cookie.get(req, 'user', 'Hd1eR7v12SdfSGc1');
     userSessionDelete(uname, res);
     res.end();
 }

 if (data) {
     const uname = data.uname;
     const pass = data.pass;
     const cause = req.headers.cause;

     if (cause === 'login') {
         const accsses = checkPass(uname, pass);
         if (!accsses) res.end('wrong');
         else {
             userSessionCreate(uname, res);
             res.end(fs.readFileSync('index.html'));
         }
     }

        if (cause === 'register') {
         addUser(uname, pass);
         newUserSession(uname);
         userSessionCreate(uname);
            res.end(fs.readFileSync('index.html'));
     }



 }

}).listen(8080);

const users = {
    'user1' : 'user1',
    'user2' : 'user2',
    'user3' : 'user3',
    'user4' : 'user4',
    'user5' : 'user5',
    'user6' : 'user6'
};

const sessions = {
    '111111111111' : {active: false, uname:'user1', token : ''},
    '222222222222' : {active: false, uname:'user2', token : ''},
    '333333333333' : {active: false, uname:'user3', token : ''},
    '444444444444' : {active: false, uname:'user4', token : ''},
    '555555555555' : {active: false, uname:'user5', token : ''},
    '666666666666' : {active: false, uname:'user6', token : ''}
};

const addUser = function(uname, passwd){
    if (!users[uname]) users[uname] = passwd;
    else res.end('There is an user with such a name');
};

const checkPass = function (uname, passwd) {
    return users[uname] === passwd;
};

const guestSession = function () {
    cookie.create(res, 'user', 'guest', 'Hd1eR7v12SdfSGc1')
};

const userSessionCreate = function (uname, res) {
    const sesID = getSessID(uname);
    const tok = token.generate;
    cookie.create(res, 'user', uname, 'Hd1eR7v12SdfSGc1');
    cookie.create(res, 'sessID', sesID, 'Hd1eR7v12SdfSGc1');
    cookie.create(res, 'token', tok, 'Hd1eR7v12SdfSGc1');
    sessions[sesID].active = true;
    sessions[sesID].token = tok;

};

const userSessionDelete = function (uname, res) {
    const sesID = getSessID(uname);
    cookie.clear(res, 'user');
    cookie.clear(res, 'sessID');
    cookie.clear(res, 'token');
    sessions[sesID].active = false;
    sessions[sesID].token = '';
};


const getSessID = function (uname) {
 for (let key in sessions) if (sessions[key].uname === uname) return key;
};

const newUserSession = function (uname) {
    sessions['77777777777'] = {active: false, uname: uname};
};



const getUser = function () {
    const user = cookie.get(req, 'user', 'Hd1eR7v12SdfSGc1');
    return user;
};

const checkUser = function (uname) {
    const key = getSessID(uname);
    return sessions[key].active === true;
};

const checkSess = (req) => {
    if (cookie.get(req, 'user', 'Hd1eR7v12SdfSGc1')) {
        const user = cookie.get(req, 'user', 'Hd1eR7v12SdfSGc1');
        const sessId = getSessID(user);
        console.log('user: ' + user);
        console.log('sessId: ' + sessId);
        if (sessions[sessId].active === true){
            const sysTok = sessions[sessId].token;
            const userTok = cookie.get(req, 'token', 'Hd1eR7v12SdfSGc1');
            console.log('active: ' + sessions[sessId].active);
            console.log('sysTok: ' + sysTok);
            console.log('userTok: ' + userTok);
            if (sysTok === userTok){return true}else return false;
        }else return false;
    } else return false;

}