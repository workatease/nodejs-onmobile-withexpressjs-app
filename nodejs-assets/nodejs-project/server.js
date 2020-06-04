
module.exports = function setupServer(callback, dir) {

    const express = require('express');
    const app = express();
    var bodyParser = require('body-parser')
    const path = require('path');
    var PouchDB = require('pouchdb');
    const nanoid = require('nanoid');

    // var fs = require('fs');
    // console.log("data dir from server",dir);
    // fs.writeFile(path.join(dir, 'hello.txt'), 'Hello content!', function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
    const db = new PouchDB(dir + '/test');
    const remoteDb = PouchDB('https://f95f5018-4c30-469c-a0bd-2f1c1d710d47-bluemix:492de14f6ab1ef4bf736b4bcbc7a33c72159a28b7aaeb8f602885c7aa7a92d45@f95f5018-4c30-469c-a0bd-2f1c1d710d47-bluemix.cloudantnosqldb.appdomain.cloud/test')

    db.sync(remoteDb, {
        live: true,
        retry: true
    }).on('change', function (change) {
        console.log('changed', change);
        // yo, something changed!
    }).on('paused', function (info) {
        console.log('paused', info);
        // replication was paused, usually because of a lost connection
    }).on('active', function (info) {
        console.log('active', info);
        // replication was resumed
    }).on('error', function (err) {
        console.log('error', err);
        // totally unhandled error (shouldn't happen)
    });
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(bodyParser.json());
    app.get('/api/getList', (req, res) => {
        db.query('sumValue/new-view', { 'group': true })
            //db.view('sumValue','new-view',{'group':true})
            .then((body) => {
                res.send(body.rows);
            });

        console.log('Sent list of items');
    });

    app.put('/api/add', (req, res) => {
        let newData = req.body;
        newData._id = nanoid.nanoid()
        db.put(newData).then((body) => {
            res.send(body);
        });

    });

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'app', 'index.html'));
    });

    app.listen(9000, callback);

};

