import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: {
        id: req.userId, provider: true,
      },
    });
    if (!checkIsProvider) {
      return res.status(401).json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    await Notification.findOne({ _id: req.params.id }, (_, notification) => {
      notification.read = !notification.read;
      notification.save();
      return res.json('Success');
    });
  }
}

export default new NotificationController();
