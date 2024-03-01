const express = require('express')
const { RsnChat } = require('rsnchat')
const { Hercai } = require('hercai')
const hercaiModule = require("./lib/hercai");
const axios = require('axios')
const simi = require('simsimi-api')
const bodyParser = require('body-parser')
const fs = require('fs')
const { Aki } = require('aki-api')
const fg = require('api-dylux')
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

//penyimpanan sementara
const readSessionsFromFile = () => {
    if (fs.existsSync('./src/akinator.json')) {
      const data = fs.readFileSync('./src/akinator.json', 'utf8');
      return JSON.parse(data);
    } else {
      return {};
    }
  };
  
  const saveSessionsToFile = (sessions) => {
    fs.writeFileSync('./src/akinator.json', JSON.stringify(sessions), 'utf8');
  };
  
  let sessions = readSessionsFromFile();

app.get('/', (req, res) => {
    res.render('index', { title: 'Homepage' });
})

//downloader
app.get('/ytmp3', async (req, res) => {
    const { url } = req.query
    if(!url) return res.json({ status: 500, message: 'Enter the link!' })

    let data = await fg.ytmp3(url)

    return res.json({ status: 200, creator: creator, hasil: data })
})

app.get('/ytmp4', async (req, res) => {
    const { url } = req.query
    if(!url) return res.json({ status: 500, message: 'Enter the link!' })

    let data = await fg.ytmp4(url)

    return res.json({ status: 200, creator: creator, hasil: data })
})

app.get('/fbdl', async (req, res) => {
    const { url } = req.query
    if(!url) return res.json({ status: 500, message: 'Enter the link!' })

    let data = await fg.fbdl(url)

    return res.json({ status: 200, creator: creator, hasil: data })
})

//games
app.get('/akinator/start', async (req, res) => {
    const region = 'id';
    const childMode = false;
  const proxy = undefined;
  const aki = new Aki({ region, childMode, proxy });

  await aki.start();

  const sessionID = Math.random().toString(36).substring(2, 15); 
  sessions[sessionID] = { aki, lastQuestion: null };

  saveSessionsToFile(sessions);

  res.json({
    status: 200,
    message: 'success',
    result: {
      session: sessionID,
      question: aki.question,
      progression: aki.progress,
      step: aki.step,
    },
  });
});
app.get('/akinator/answer', async (req, res) => {
    const { session, answer } = req.query;
  
    if (!sessions[session]) {
      return res.json({
        status: 404,
        message: 'Session not found',
        result: null,
      });
    }
  
    const { aki } = sessions[session];
    
    // Mengubah jawaban menjadi indeks
    let answerIndex;
    switch(answer.toLowerCase()) {
        case 'ya':
            answerIndex = 0;
            break;
        case 'tidak':
            answerIndex = 1;
            break;
        case 'tidak tahu':
            answerIndex = 2;
            break;
        case 'mungkin':
            answerIndex = 3;
            break;
        case 'mungkin tidak':
            answerIndex = 4;
            break;
        default:
            return res.status(400).json({
                status: 400,
                message: 'Invalid answer\nanswer avaible: ya, tidak, tidak tahu, mungkin, mungkin tidak',
                result: null,
            });
    }
  
    try {
      await aki.step(answerIndex);
  
      sessions[session].lastQuestion = aki.question;
  
      saveSessionsToFile(sessions);
  
      res.json({
        status: 200,
        message: 'success',
        result: {
          session,
          question: aki.question,
          progression: aki.progress,
          step: aki.currentStep,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'Error answering the question',
        result: null,
      });
    }
});

  app.get('/akinator/back', async (req, res) => {
    const { session } = req.query;
  
    if (!sessions[session]) {
      return res.json({
        status: 404,
        message: 'Session not found',
        result: null,
      });
    }
  
    const { aki } = sessions[session]; // Mengambil objek Akinator dari properti aki
  
    try {
      if (aki.currentStep && aki.currentStep > 0) {
        aki.back();
  
        sessions[session].aki = aki; // Menyimpan kembali objek Akinator ke dalam properti aki
        
        res.json({
          status: 200,
          message: 'success',
          result: {
            session,
            question: aki.question,
            progression: aki.progression,
            step: aki.currentStep,
          },
        });
      } else {
        res.json({
          status: 400,
          message: 'Cannot go back, already at the beginning',
          result: null,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'Error going back',
        result: null,
      });
    }
  });
  app.get('/akinator/end', async (req, res) => {
    const { session } = req.query;
  
    if (!sessions[session]) {
      return res.json({
        status: 404,
        message: 'Session not found',
        result: null,
      });
    }
  
    const { aki } = sessions[session]; // Mengambil objek Akinator dari properti aki
  
    try {
      await aki.win();
  
      const result = {
        session,
        guess: aki.answers[0],
        guessCount: aki.guessCount,
      };
  
      // Hapus sesi dari sessions setelah permainan selesai
      delete sessions[session];
  
      // Simpan perubahan ke dalam berkas akinator.json
      saveSessionsToFile(sessions);
  
      res.json({
        status: 200,
        message: 'success',
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: 'Error finishing the game',
        result: null,
      });
    }
  });

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
