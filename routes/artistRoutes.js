const router = require('express').Router()

router.get('/', async (req, res) => {
  return res.json("getting all artist")
})

module.exports = router