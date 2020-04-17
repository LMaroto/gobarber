import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';


class ScheduleController {
  async index(req, res) {
    // verificando se o user é um provider
    const checkUserProvider = await User.findOne({ where: { id: req.userId, provider: true } });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    const { date } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseISO(date)), endOfDay(parseISO(date))],
        },
      },
      attributes: ['id', 'date', 'createdAt', 'updatedAt', 'canceled_at'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}
export default new ScheduleController();
