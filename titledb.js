const fetch = require("node-fetch");

const titles = {};

const loadTitleDb = async () => {
    try {
        const res = await fetch("https://raw.githubusercontent.com/blawar/titledb/master/titles.US.en.json");
        const resText = await res.text();
        Object.assign(titles, JSON.parse(resText));
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    loadTitleDb: loadTitleDb,
    getTitleLatestVersion: titleId => {
        const title = titles[titleId];
        for(const prop in title) {
            if(prop === "version") return title.version;
        }
        return null;
    }
};