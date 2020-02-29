const { Router } = require('express')
const Link = require('../models/Link')
const authMiddleware = require('../middleware/auth.middleware')
const config = require('config')
const shortid = require('shortid')
const router = Router()

router.post(
  '/generate',
  authMiddleware,
async ( req, res) => {
  try {

    const baseUrl = config.get('baseUrl')
    const { from } = req.body

    const code = shortid.generate()

    const existing = await Link.findOne({ from })
    if ( existing) {
      return res.json({ link: existing })
    }

    const to = baseUrl + '/t/' + code

    const link = new Link({
      code, to, from, owner: req.user.userId
    })


    await link.save()

    res.status(201).json({ link })

  } catch (error) {
    res
        .status(500)
        .json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

router.get('/',
authMiddleware,
async ( req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId })

    res.json(links)
  } catch (error) {
    res
        .status(500)
        .json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

router.get('/:id',
authMiddleware,
async ( req, res) => {
  try {
    console.log("TCL: req.params", req.params)
    const links = await Link.findById(req.params.id)

    console.log("TCL: links", links)

    res.json(links)
  } catch (error) {
    res
        .status(500)
        .json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

module.exports = router
