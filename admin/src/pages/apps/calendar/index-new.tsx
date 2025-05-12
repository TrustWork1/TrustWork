import Calendar from "src/@core/components/calendar"

const rows = [
  {
    _id: '6648dfd65854df',
    name: 'Bapi Biswas',
    service: 'Message',
    events: [
      {
        date: '25-09-2024',
        event: 'Meeting with client',
        duration: 15
      },
      {
        date: '25-09-2024',
        event: 'Meeting with client2',
        duration: 15
      },
      {
        date: '25-09-2024',
        event: 'Meeting with client3',
        duration: 15
      },
      {
        date: '05-10-2024',
        event: 'Meeting with client3',
        duration: 15
      }
    ]
  },
  {
    _id: '7284bcf75834cb',
    name: 'Amit Singh',
    service: 'Consulting',
    events: [
      {
        date: '14-10-2024',
        event: 'Team training'
      }
    ]
  },
  {
    _id: '9284cde75934dd',
    name: 'Priya Shah',
    service: 'Therapy',
    events: [
      {
        date: '15-10-2024',
        event: 'Session with patient'
      }
    ]
  },
  {
    _id: '1198fkd34560ef',
    name: 'Rajiv Patel',
    service: 'Nursing',
    events: [
      {
        date: '12-10-2024',
        event: 'Shift coverage'
      }
    ]
  },
  {
    _id: '2175fka09847hf',
    name: 'Suman Gupta',
    service: 'Massage Therapy',
    events: [
      {
        date: '18-10-2024',
        event: 'Wellness workshop'
      }
    ]
  },
  {
    _id: '3189gbf28956ge',
    name: 'Deepak Verma',
    service: 'Physiotherapy',
    events: [
      {
        date: '19-10-2024',
        event: 'Group exercise session'
      }
    ]
  },
  {
    _id: '4789hgf48950hj',
    name: 'Neha Mehta',
    service: 'Healthcare Consulting',
    events: [
      {
        date: '20-10-2024',
        event: 'Client assessment'
      }
    ]
  },
  {
    _id: '5889ghd58965ik',
    name: 'Karan Malhotra',
    service: 'Nutrition',
    events: [
      {
        date: '22-10-2024',
        event: 'Dietary planning session'
      }
    ]
  },
  {
    _id: '6498lkj67983jl',
    name: 'Suresh Rao',
    service: 'Rehabilitation',
    events: [
      {
        date: '23-10-2024',
        event: 'Therapy session'
      }
    ]
  },
  {
    _id: '7589jhg78956km',
    name: 'Ravi Shankar',
    service: 'Social Work',
    events: [
      {
        date: '24-10-2024',
        event: 'Community outreach'
      }
    ]
  },
  {
    _id: '8719khl89134ln',
    name: 'Sunita Desai',
    service: 'Medical Assistance',
    events: [
      {
        date: '25-10-2024',
        event: 'Medical camp'
      }
    ]
  },
  {
    _id: '9584mbh98564op',
    name: 'Anjali Kapoor',
    service: 'Psychology',
    events: [
      {
        date: '26-10-2024',
        event: 'Mental health seminar'
      }
    ]
  },
  {
    _id: '1056nml10984pq',
    name: 'Vikram Khanna',
    service: 'Pharmacy',
    events: [
      {
        date: '27-10-2024',
        event: 'Medication review'
      }
    ]
  },
  {
    _id: '1123opl12345qr',
    name: 'Megha Joshi',
    service: 'Radiology',
    events: [
      {
        date: '28-10-2024',
        event: 'X-ray diagnostics'
      }
    ]
  },
  {
    _id: '1298prq14567st',
    name: 'Harshita Rao',
    service: 'Dental',
    events: [
      {
        date: '29-10-2024',
        event: 'Routine dental checkup'
      }
    ]
  },
  {
    _id: '1345stu15678uv',
    name: 'Mohit Jain',
    service: 'Medical Imaging',
    events: [
      {
        date: '30-10-2024',
        event: 'CT scan review'
      }
    ]
  }
]

const AppCalendar = () => {
  return <Calendar rows={rows} data={{ page_title: 'TrustWork', table_resource_title: 'Employee' }} />
}

export default AppCalendar
