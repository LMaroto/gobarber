import Agenda from 'agenda';
import CancellationMail from '../app/jobs/CancellationMail';

const agenda = new Agenda();
agenda.database(
  'mongodb+srv://admin:20171130@gobarber-xjxid.gcp.mongodb.net/queues?retryWrites=true&w=majority',
  'jobs',
);
// tirei o every daqui

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.init();
  }

  init() {
    jobs.forEach((job) => {
      agenda.define(job.key, job.handle);
    });
  }

  async add(queue, job) {
    // se isso não funcionar, deixa agenda.now(queue, job);
    // coloquei pq de acordo com a doc q vscode me recomendou:
    // now retorna uma promise de job, que por sua vez tem um método
    // save que também é uma promise
    agenda.now(queue, job);
  }

  async processQueue() {
    await agenda.start();
    // every é depois de que o servidor da agenda é iniciado
    // configurando o tempo que a fila deve ser processada, agendado.
    await agenda.every('30 seconds', CancellationMail.key);
  }
}

export default new Queue();
