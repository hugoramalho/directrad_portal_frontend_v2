const ELEMENT_DATA: PeriodicElement[] = [
  {
      numImagens: '#951',
      taskName: 'Hotel management system',
      paciente: 'Shawn Kennedy',
      dataNascimento: '12 Nov, 2024',
      dataExame: '15 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          inProgress: 'In Progress',
          // pending: 'Pending',
          // completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#587',
      taskName: 'Send proposal to APR Ltd',
      paciente: 'Roberto Cruz',
      dataNascimento: '12 Nov, 2024',
      dataExame: '14 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          // inProgress: 'In Progress',
          pending: 'Pending',
          // completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#618',
      taskName: 'Python upgrade',
      paciente: 'Juli Johnson',
      dataNascimento: '12 Nov, 2024',
      dataExame: '13 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          // inProgress: 'In Progress',
          // pending: 'Pending',
          completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#367',
      taskName: 'Schedule meeting with Daxa',
      paciente: 'Catalina Engles',
      dataExame: '12 Nov, 2024',
      dataNascimento: '12 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          // inProgress: 'In Progress',
          // pending: 'Pending',
          // completed: 'Completed',
          notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#761',
      taskName: 'Engineering lite touch',
      paciente: 'Louis Nagle',
      dataNascimento: '12 Nov, 2024',
      dataExame: '11 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          inProgress: 'In Progress',
          // pending: 'Pending',
          // completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#431',
      taskName: 'Refund bill payment',
      paciente: 'Michael Marquez',
      dataNascimento: '12 Nov, 2024',
      dataExame: '10 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          // inProgress: 'In Progress',
          // pending: 'Pending',
          // completed: 'Completed',
          notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#421',
      taskName: 'Public beta release',
      paciente: 'James Andy',
      dataNascimento: '12 Nov, 2024',
      dataExame: '09 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          inProgress: 'In Progress',
          // pending: 'Pending',
          // completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#624',
      taskName: 'Fix platform errors',
      paciente: 'Alina Smith',
      dataNascimento: '12 Nov, 2024',
      dataExame: '08 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          // inProgress: 'In Progress',
          // pending: 'Pending',
          completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  },
  {
      numImagens: '#513',
      taskName: 'Launch our mobile app',
      paciente: 'David Warner',
      dataNascimento: '12 Nov, 2024',
      dataExame: '07 Nov, 2024',
      modalidade: 'CT',
      study: 'Abdome',
      uid: '1.2.392.200036.9107.500.111234524111113002',
      status: {
          // inProgress: 'In Progress',
          pending: 'Pending',
          // completed: 'Completed',
          // notStarted: 'Not Started',
      },
     action: {
          download: 'download',
          access: 'key',
          view: 'visibility',
          edit: 'more_vert',
          delete: 'delete'
      }
  }
];

export interface PeriodicElement {
  taskName: string;
  numImagens: string;
  paciente: string;
  dataNascimento: string;
  dataExame: string;
  modalidade: string;
  study: string;
  uid: string;
  status: any;
  action: any;
}