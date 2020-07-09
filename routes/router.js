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

//homepage redirects the sender config page
router.route('/')
    .get((req, res) => {
        res.redirect('sender')
    })
//test mail address and credentials
router.route('/testmail').get(async (req, res) => {
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
                    mail: r.mail
                })
            } else
                res.render('sender', {
                    host: "Host Adresi",
                    port: "Port Numarsı",
                    mail: "Email Adresi"
                })
        })
    })
    .post((req, res) => {
        DB.insertUser(
            req.body.host,
            req.body.port,
            req.body.email,
            req.body.password
        )
        res.render('sender', {
            host: req.body.host,
            port: req.body.port,
            mail: req.body.email
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
                console.log(err)
                next(err)
                return
            }
            DB.readUploadedFile(files.receivers.path).then(r => {
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
    .get((req, res) => {
        res.render('monitoring', Boolean(isRunning) ? {runStop: 'Durdur'} : {runStop: 'Çalıştır'})

    })

router.route('/firstRun')
    .get((req, res) => {
        let announs = new Announcement(1,1,1)
        announs.firstRun().then(r => {
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


function main(url, regex, bolum) {
    let announs = new Announcement(url, regex, bolum)
    announs.check()
}
function timer() {
    isRunning = true
    main(department.url.fakulte, department.regex.fakulte, department.faculty.fakulte)
    main(department.url.bilgisayar, department.regex.bilgisayar, department.faculty.bilgisayar)
    main(department.url.biyomedikal, department.regex.biyomedikal, department.faculty.biyomedikal)
    main(department.url.cevre, department.regex.cevre, department.faculty.cevre)
    main(department.url.elektronik, department.regex.elektronik, department.faculty.elektronik)
    main(department.url.endustri, department.regex.endustri, department.faculty.endustri)
    main(department.url.insaat, department.regex.insaat, department.faculty.insaat)
    main(department.url.makine, department.regex.makine, department.faculty.makine)
    main(department.url.tekstil, department.regex.tekstil, department.faculty.tekstil)
}

function stopTimer() {
    isRunning = false
    clearInterval(setTimer);
}
module.exports = router;