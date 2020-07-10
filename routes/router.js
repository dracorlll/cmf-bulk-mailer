const express = require('express')
const router = express.Router()
const department = require('../helpers/Departments')
const formidable = require('formidable')
const DB = require('../controllers/database')
const email = require("../controllers/email")
const Announcement = require('../controllers/announcement.js')
let isRunning = false
let setTimer
let interval = 5000

//test mail address and credentials
router.route('/testmail').get((req, res) => {
    email.testMail().then(r => res.send(r)).catch(r => res.send(r))
})
//sender page
router.route('/sender')
    .get((req, res) => {
        DB.findUser().then(r => {
            if (r != null) {
                res.render('sender', {
                    host: r.host,
                    port: r.port,
                    mail: r.mail,
                    failed: false
                })
            } else
                res.render('sender')
        })
    })
    .post((req, res) => {
        email.testMail(req.body)
            .then(r => {
                DB.insertUser(
                    req.body.host,
                    req.body.port,
                    req.body.email,
                    req.body.password
                )
                res.render('sender', {
                    host: req.body.host,
                    port: req.body.port,
                    mail: req.body.email,
                    saved: true,
                    failed: false
                })
            })
            .catch(r => {
                let errResponse = Object.keys(r).map((k) => r[k])
                res.render('sender', {
                    failed: true,
                    errResponse: errResponse
                })
            })
    })

//receiver page
router.route('/receiver')
    .get((req, res) => {
        res.render('receiver')
    })
    .post((req, res, next) => {
        const form = formidable({multiples: true, uploadDir: __dirname});
        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err)
            }
            DB.readUploadedFile(files.receivers.path).then(r => {
                if (r.students.length !== 0)
                    DB.insertReceivers(r.students)
                res.render('modal', {
                    line: r.unwritten.length + r.students.length,
                    saved: r.students.length,
                    err: r.unwritten.length,
                    lineNumber: r.unwritten
                })
            })
        });
    })

//monitoring sayfası
router.route('/monitoring')
    .get(async (req, res) => {
        if (await DB.findUser() === null)
            res.render('nouser')
        else if (await DB.findReceiver() === null)
            res.render('noreceiver')
        else
            res.render('monitoring', Boolean(isRunning) ? {runStop: 'Durdur'} : {runStop: 'Çalıştır'})

    })

router.route('/firstRun')
    .get((req, res) => {
        let announs = new Announcement(1, 1, 1)
        announs.firstRun(department.url).then(r => {
            isRunning = true
            setTimer = setInterval(timer, interval);
            res.send('ok')
        })
    })

router.route('/run')
    .get((req, res) => {
        isRunning = true
        setTimer = setInterval(timer, interval);
        res.send('ok')
    })

router.route('/stop')
    .get((req, res) => {
        isRunning = false
        stopTimer()
        res.send('ok')
    })

router.route('/shutdown')
    .get((req, res) => {
        res.send('ok')
        process.exit()
    })

router.route('/ghost')
    .get((req, res) => {
        email.ghostMail().then(r => res.send(r))
    })

router.route('*')
    .get((req, res) => {
        res.redirect('/sender')
    })

function timer() {
    isRunning = true
    let key = Object.keys(department.url)
    for (let i = 0; i < key.length; i++) {
        new Announcement(department.url[key[i]], department.regex[key[i]], department.faculty[key[i]]).check()
    }
}

function stopTimer() {
    isRunning = false
    clearInterval(setTimer);
}

module.exports = router;