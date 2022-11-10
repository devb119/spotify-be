const router = require('express').router()

router.get('/', async (req, res) => {
  return res.json("getting all songs")
})

module.exports = router