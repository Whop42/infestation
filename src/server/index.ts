import express from 'express';

export const api = express();

api.get('/api/test', (_, res) => 
    res.json({ greeting: "Hello, World!" })
)

if (!process.env['VITE']) {
    const frontendFiles = process.cwd() + '/dist'
    api.use(express.static(frontendFiles))
    api.get('/*', (_, res) => {
      res.send(frontendFiles + '/index.html')
    })
    api.listen(process.env['PORT'])
  }