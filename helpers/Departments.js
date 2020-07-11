const faculty = {
    fakulte: "Çorlu Mühendislik Fakültesi",
    bilgisayar: "Çorlu Mühendislik Fakültesi Bilgisayar Mühendisliği",
    biyomedikal: "Çorlu Mühendislik Fakültesi Biyomedikal Mühendisliği",
    cevre: "Çorlu Mühendislik Fakültesi Çevre Mühendisliği",
    elektronik: "Çorlu Mühendislik Fakültesi Elektronik ve Haberleşme Mühendisliği",
    endustri: "Çorlu Mühendislik Fakültesi Endüstri Mühendisliği",
    insaat: "Çorlu Mühendislik Fakültesi İnşaat Mühendisliği",
    makine: "Çorlu Mühendislik Fakültesi Makine Mühendisliği",
    tekstil: "Çorlu Mühendislik Fakültesi Tekstil Mühendisliği"
}

const regex = {
    fakulte: [/(.*?)/],
    bilgisayar: [/[0-9]{3}((0606)|(0656))[0-9]{3}/],
    biyomedikal: [/[0-9]{3}(0607)[0-9]{3}/],
    cevre: [/[0-9]{3}((0601)|(0653))[0-9]{3}/],
    elektronik: [/[0-9]{3}((0605)|(0654))[0-9]{3}/],
    endustri: [/[0-9]{3}(0608)[0-9]{3}/],
    insaat: [/[0-9]{3}(0602)[0-9]{3}/],
    makine: [/[0-9]{3}((0603)|(0655))[0-9]{3}/],
    tekstil: [/[0-9]{3}(0604)[0-9]{3}/]
}

const url = {
    fakulte: "http://cmf.nku.edu.tr/0/duyuruarsiv/m/",
    bilgisayar: "http://cmf-bm.web.nku.edu.tr/0/duyuruarsiv/m/",
    biyomedikal: "http://cmf-bmm.web.nku.edu.tr/0/duyuruarsiv/m/",
    cevre: "http://cmf-cm.web.nku.edu.tr/0/duyuruarsiv/m/",
    elektronik: "http://cmf-ehm.web.nku.edu.tr/0/duyuruarsiv/m/",
    endustri: "http://cmf-em.web.nku.edu.tr/0/duyuruarsiv/m/",
    insaat: "http://cmf-im.web.nku.edu.tr/0/duyuruarsiv/m/",
    makine: "http://cmf-mm.web.nku.edu.tr/0/duyuruarsiv/m/",
    tekstil: "http://cmf-tm.web.nku.edu.tr/0/duyuruarsiv/m/"
}
module.exports = {regex, url, faculty}