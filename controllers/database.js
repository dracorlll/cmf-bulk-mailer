const MongoClient = require('mongodb').MongoClient
const url = (process.argv.length === 2) ? ("mongodb://mongodb:27017/mydb") : ("mongodb://" + process.argv[2] + ":27017/mydb")
const fs = require('fs')
const readLine = require('readline')

module.exports = {
    insertAnnouncement: async (text, address) => {
        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")

        await dbo.collection("announcements").insertOne({text: text, address: address})
    },
    insertUser: async (host, port, mail, pass) => {
        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")

        //users tablosunu siliyoruz çünkü sadece tek kullanıcı olacak
        try {
            await dbo.collection('users').drop()
        } catch (e) {

        }
        await dbo.collection('users').insertOne({host: host, port: port, mail: mail, pass: pass})
    },
    findUser: async () => {

        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")

        return dbo.collection("users").findOne()

    },
    findReceiver: async () => {
        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")

        return dbo.collection("students").findOne()
    },
    findAnnouncement: async (address) => {
        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")

        return dbo.collection("announcements").findOne({address: address})
    },
    findReceivers: async (department) => {
        //split the receivers by given regex
        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")

        return dbo.collection("students").find({studentMail: {$in: department}}, {projection: {_id: 0}}).toArray()
    },
    readUploadedFile: async (filePath) => {
        let students = []
        let unwritten = []
        let lineNumber = 0
        //make sure that emails are from nku.edu
        let pattern = new RegExp(/[0-9]{10}@nku.edu.tr/)
        //init readline
        let lineReader = readLine.createInterface({
            input: fs.createReadStream(filePath)
        })
        for await (const line of lineReader) {
            if (pattern.test(line))
                students.push({studentMail: line})
            else
                unwritten.push(lineNumber)
            lineNumber++
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err)
            }
        })
        return {unwritten: unwritten, students: students}
    },
    insertReceivers: async (students, remove) => {
        const db = await MongoClient.connect(url)
        const dbo = db.db("mydb")
        try {
            if (remove) {
                await dbo.collection('students').drop()
            }

        } catch (e) {

        }
        await dbo.collection("students").insertMany(students)
    }

}