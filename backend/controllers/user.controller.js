const User = require('../models/User');
const Property = require('../models/Property');

// @PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio, address, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/users/wishlist/:propertyId
exports.toggleWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user._id);

    const isWishlisted = user.wishlist.includes(propertyId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== propertyId);
    } else {
      user.wishlist.push(propertyId);
    }

    await user.save();
    res.json({ success: true, wishlisted: !isWishlisted, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/users/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'wishlist',
        match: { isActive: true },
        populate: { path: 'host', select: 'name avatar' }
      });
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
