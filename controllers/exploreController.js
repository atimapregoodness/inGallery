
const PublishImg = require('../models/publish');
const UploadImg = require('../models/upload');


exports.getExplore = async (req, res) => {
  const { search } = req.query;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 30;

  if (search) {
    try {
      const imgs = await PublishImg.find({
        $or: [
          { category: new RegExp(search, 'i') },
          { 'img.filename': new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ]
      }).populate('user').skip(skip).limit(limit);
      res.render('explore', { imgs, search });
    } catch (error) {
      console.error(error);
      res.redirect('/explore');
    }
  } else {
    try {
      const imgs = await PublishImg.find({}).populate('user').skip(skip).limit(limit);
      res.render('explore', { imgs });

    } catch (error) {
      console.error(error);
      res.redirect('/explore');
    }
  }
};

exports.getImg = async (req, res) => {

  const { id } = req.params;

  const user = req.user;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 30;

  const imgs = await UploadImg.findById(id).populate('user');
  const findImg = await PublishImg.findById(imgs._id).populate('user');


  if (user && findImg && imgs) {
    const userId = req.user._id.toString();
    const findImgId = findImg.user._id.toString();

    if (userId !== findImgId && !findImg.views.includes(user._id)) {
      findImg.views.push(user._id);
      await findImg.save();
      // console.log('user is not the owner');
    } else if (findImg.views.includes(user._id)) {
      // console.log('user has already viewed the image');
    } else {
      // console.log('user is the owner');
    }
  }

  let views = findImg.views.length;

  const findCateogory = await PublishImg.find({
    $or: [
      { category: new RegExp(imgs.category, 'i') },
      { 'imgs.img.filename': new RegExp(imgs.filename, 'i') },
      { description: new RegExp(imgs.description, 'i') }
    ]

  }).populate('user').skip(skip).limit(limit);

  res.render('imgPreview', { imgs, findCateogory, views });
};