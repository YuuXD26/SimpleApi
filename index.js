const express = require('express')
const { RsnChat } = require('rsnchat')
const { Hercai } = require('hercai')
const hercaiModule = require("./lib/hercai");
const axios = require('axios')
const simi = require('simsimi-api')
const bodyParser = require('body-parser')
const ai = require("./lib/ai")
const neko = require('./lib/nekopoi')
const { textToImage } = require('./lib/tti')
const imageUploaderModule = require("./lib/mj")
const { getPinterestImages } = require("./lib/pinterest");
const path = require('path');

const rsnchat = new RsnChat('rsnai_Iois6NIEJSqE9sG8bmgPaYC8')
const hercai = new Hercai()

const app = express()
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validApiKeys = {
    ItsBayy: true,
    OnlyTasya: true,
  };

const cekid_url = 'https://api.kitadigital.my.id/api/game'

const noapi = 'Please input a text or apikey!'
const invalidapi = 'Apikey is invalid!'
const creator = 'ItsBayy'

app.get('/', (req, res) => {
    res.render('index', { title: 'Homepage' });
})

//stalker 
app.get('/mobile-legends', async (req, res) => {
    const { id, zone } = req.query;

    var response = await axios.get(`${cekid_url}/mobile-legends-dg?id=${id}&zone=${zone}`)

    var responseData = response.data.data;

    return res.status(200).json({ status: 200, creator: creator, message: 'Account found successfully!', username: responseData.username });
})

app.get('/free-fire', async (req, res) => {
    const { id } = req.query;

    var response = await axios.get(`${cekid_url}/free-fire?id=${id}`)

    var responseData = response.data.data;

    return res.status(200).json({ status: 200, creator: creator, message: 'Account found successfully!', username: responseData.username });
})

app.get('/genshin-impact', async (req, res) => {
    const { id } = req.query;

    var response = await axios.get(`${cekid_url}/genshin-impact?id=${id}&zone=os_asia`)

    var responseData = response.data.data;

    return res.status(200).json({ status: 200, creator: creator, message: 'Account found successfully!', username: responseData.username });
})

app.get('/star-rail', async (req, res) => {
    const { id } = req.query;

    var response = await axios.get(`${cekid_url}/honkai-star-rail?id=${id}&zone=prod_official_asia`)
    console.log(response)

    var responseData = response.data.data;

    return res.status(200).json({ status: 200, creator: creator, message: 'Account found successfully!', username: responseData.username });
})

//ai chat

app.get('/simi', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    simi.simtalk(text, 'id').then((response) => {
        console.log(response);
        return res.status(200).json({ status: 200, creator: creator, message: response.message })
      });
})

app.get('/gemini', (req, res) => {
    const { text, apikey } = req.query
    if(!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if(!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    rsnchat.gemini(text).then((response) => {
        return res.status(200).json({ status: 200, creator: creator, message: response.message })
    })
})

app.get('/bard', (req, res) => {
    const { text, apikey } = req.query
    if(!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if(!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    rsnchat.bard(text).then((response) => {
        return res.status(200).json({ status: 200, creator: creator, message: response.message })
    })
})

app.get('/gpt', (req, res) => {
    const { text, apikey } = req.query
    if(!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if(!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    rsnchat.gpt(text).then((response) => {
        return res.status(200).json({ status: 200, creator: creator, message: response.message })
    })
})

app.get('/llama', (req, res) => {
    const { text, apikey } = req.query
    if(!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if(!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    rsnchat.llama(text).then((response) => {
        return res.status(200).json({ status: 200, creator: creator, message: response.message })
    })
})

//ai image

app.get('/text2img', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    try {
        textToImage(text)
    .then(async (imageData) => {
        return res.status(200).json({ status: 200, creator: creator, imageUrl: imageData.url.result_url })
        })
    } catch (error) {
        console.error("Error while uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/prodia', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    try {
        const response = await hercaiModule.getHercaiImage(
            text,
            "prodia"
          );
        return res.status(200).json({ status: 200, creator: creator, imageUrl: response.url })
    } catch (error) {
        console.error("Error while uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/midjourney', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    try {
        const imageUrlData = await imageUploaderModule.saveImageAndGenerateURL(text);
        return res.status(200).json({ status: 200, creator: creator, imageUrl: imageUrlData.imageUrl })
    } catch (error) {
        console.error("Error while uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/leonardo', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    try {
        const imageUrlData = await ai.saveImageLeonardo(text);
        return res.status(200).json({ status: 200, creator: creator, imageUrl: imageUrlData.imageUrl })
    } catch (error) {
        console.error("Error while uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/lora', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    try {
        const imageUrlData = await ai.saveImageLora(text);
        console.log(imageUrlData)
        return res.status(200).json({ status: 200, creator: creator, imageUrl: imageUrlData.imageUrl })
    } catch (error) {
        console.error("Error while uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.get('/dalle', async (req, res) => {
    const { text, apikey } = req.query
    if (!text || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    try {
        const imageUrlData = await ai.saveImageDalle(text);
        console.log(imageUrlData)
        return res.status(200).json({ status: 200, creator: creator, imageUrl: imageUrlData.imageUrl })
    } catch (error) {
        console.error("Error while uploading image:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//search

app.get('/pinterest', async (req, res) => {
    const { query, apikey } = req.query
    if (!query || !apikey) {
        return res.status(400).json({ error: noapi })
    }
    if (!validApiKeys[apikey]) {
        return res.status(401).json({ error: invalidapi })
    }
    const results = await getPinterestImages(query);
    return res.status(200).json({ status: 200, creator: creator, imageUrl: results })
})

app.listen(8080, () => {
    console.log('Api is Listening for the Request!')
})
