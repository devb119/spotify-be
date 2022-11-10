const router = require('express').router()

router.get('/', async (req, res) => {
  return res.json("getting all artist")
})

module.exports = router