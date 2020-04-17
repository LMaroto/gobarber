import * as Yup from 'yup';

import {
  startOfHour, parseISO, isBefore, format, subHours,
} from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    // definindo schema para validação de appointment
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });
    // verificando se o schema nao é valido

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    // verificando se o id informado pela req é provider

    const { provider_id, date } = req.body;

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers.' });
    }

    // verificando se o id informado pela req é o mesmo do provider

    if (req.userId === provider_id) {
      return res.status(401).json({
        error: 'You can only create appointments with another provider.',
      });
    }

    // verificando se a data ja passou

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted.' });
    }

    // verificando se o horario esta disponivel

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available.' });
    }

    // notificando provider

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM',' iiii', às' HH':'mm'",
      { locale: ptLocale },
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}.`,
      user: provider_id,
    });
    // criando appointment no bd
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    // enviando email para avisar o provider do cancelamento
    // mudei para await por ter feito modificações na queue, mas caso não funcione é
    // só remover

    // também passei corretamente o nome da fila que o job deve ser adicionado,
    // pegando a chave pela property key
    // console.log(appointment);

    const appointment_new = {
      date: appointment.date,
      user: {
        name: appointment.user.name,
      },
      provider: {
        name: appointment.provider.name,
        email: appointment.provider.email,
      },
    };

    Queue.add(CancellationMail.key, { appointment: appointment_new });

    return res.json(appointment);
  }
}
export default new AppointmentController();
