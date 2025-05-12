import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200
  })

  if (req.method === 'GET') {
    if (req?.headers?.token === process.env.ACCESS_KEY) {
      const searchText = decodeURIComponent(req?.query?.input as string)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      const response = await axios.get(url)
      res.status(200).send(JSON.stringify(response?.data))
    } else {
      res.status(401)
      res.status(401).json({
        message: 'Access key required | contact TrustWork Support'
      })
    }
  } else {
    res.status(500).json({ message: 'Something went wrong! Please use GET method!' })
  }
}
