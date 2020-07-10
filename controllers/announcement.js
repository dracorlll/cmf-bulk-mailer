const cheerio = require('cheerio')
const got = require('got')
const DB = require("./database")
const email = require("./email")

module.exports = class Announcement {

    constructor(url, regex, department) {
        this.url = url
        this.regex = regex
        this.department = department
    }

    async check() {
        //get all announcements
        let response = await this.getRequest(this.url)
        let $ = cheerio.load(response.body)
        //checking the most recent announcement
        let announce = $('#icerik > div > a:nth-child(2)')
        //did we check before?
        let isSent = await this.isSentBefore(announce.attr('href'))
        //if its a new announcement
        if (isSent === true) {
            //save the new announcement into database
            DB.insertAnnouncement(announce.text(), announce.attr('href'))
            //get the content of announcement and edit
            let fetchAnnounce = await this.getRequest(announce.attr('href'))
            let announceContent = this.editContent(fetchAnnounce.body)

            //send announcement to the receivers
            return await email.send(announceContent.title, this.department, announceContent.content, this.regex)
        }
        //else
        else
            return 'old announcement'
    }
    async firstRun(urls){
        for await (const [key, value] of Object.entries(urls)) {
            //get all announcements
            let response = await this.getRequest(value)
            let $ = cheerio.load(response.body)
            //checking the most recent announcement
            let announce = $('#icerik > div > a:nth-child(2)')
            await DB.insertAnnouncement(announce.text(), announce.attr('href'))
        }
        return true
    }
    getRequest(url) {
        try {
            return got(url)
        } catch (error) {
            console.log('GET ERR: ' + error)
        }
    }

    async isSentBefore(announs) {
        let isSent = await DB.findAnnouncement(announs)
        return isSent === null;
    }

    editContent(content) {
        //editing unwanted parts before send mails
        let $ = cheerio.load(content)
        //remove tweet word
        $("#icerik > div.col-md-9.col-xs-12 > div:nth-child(5)").remove()
        //get announcement title
        let title = $("#icerik > div.col-md-9.col-xs-12 > h4").text()
        //remove announcement date
        $("#icerik > div.col-md-9.col-xs-12 > div.btn-danger").remove()
        content = $("#icerik > div.col-md-9.col-xs-12")

        return {title: title, content: content.html()}
    }
}
