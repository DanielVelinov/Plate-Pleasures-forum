import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const tweets = [{
  id: 1,
  title: 'Hello world',
  content: 'Hello from -=- Not a Twitter App -=-',
  createdOn: new Date(),
  liked: false,
}];
let nextTweetId = 2;

app.get('/tweets', (req, res) => {
  if(req.query.search) {
    res.json(tweets.filter((tweet) => 
  tweet.title.toLowerCase().includes(req.query.search.toLocaleLowerCase())))
  }
  
  res.json(tweets);
});

app.get('/tweets/:id', (req, res) => {
  const tweet = tweets.find((tweet) => tweet.id === +req.params.id);

  if(!tweet) {
    res.sendStatus(404);
    return;
  }

  res.json(tweet);
});

app.post('/tweets', (req, res) => {
  const tweet = {
    id: nextTweetId++,
    title: req.body.title,
    content: req.body.content,
    liked: false,
    createdOn: new Date(),
  };
  tweets.push(tweet);

  res.json(tweet);
});

app.put('/tweets/:id', (req, res) => {
  const tweet = tweets.find((tweet) => tweet.id === +req.params.id);

  if (!tweet) {
    res.sendStatus(404);
    return;
  }
  tweet.title = req.body.title;
  tweet.content = req.body.content;
  tweet.liked = req.body.liked;

  res.json(tweet);
});

app.delete('/tweets/:id', (req, res) => {
  const index = tweets.findIndex((tweet) => tweet.id === +req.params.id);

  if (index === -1) {
    res.sendStatus(404);
    return;
  }
  tweets.splice(index, 1);

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});