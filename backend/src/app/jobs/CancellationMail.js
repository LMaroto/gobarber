import { format } from 'date-fns';
import ptLocale from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  // recebe direto o job e depois desestrutura
  // parametro de entrada poderia receber apenas attrs
  // async handle({attrs}) { ... }
  async handle(job) {
    const { appointment } = job.attrs.data; // job.attrs.data.appointment
    const formattedDate = format(
      appointment.date,
      "dd 'de' MMMM',' HH':'mm",
      { locale: ptLocale },
    );

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}`,
      subject: 'Agendamento cancelado',
      text: 'Você tem um novo cancelamento',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: formattedDate,
      },
    });
  }
}

export default new CancellationMail();
