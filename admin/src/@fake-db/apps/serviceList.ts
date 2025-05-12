// import mock from 'src/@fake-db/mock';

// // Sample service list
// const serviceList = [
//   { id: 1, name: "General Check-Up", description: "A routine examination to assess overall health and detect any potential issues early." },
//   { id: 2, name: "Pediatric Care", description: "Medical services focused on the health and development of infants, children, and adolescents." },
//   { id: 3, name: "Cardiology Consultation", description: "Specialized care for heart-related conditions, including diagnosis and management of cardiovascular diseases." },
//   { id: 4, name: "Orthopedic Surgery", description: "Surgical procedures to treat musculoskeletal issues such as fractures, joint disorders, and spinal conditions." },
//   { id: 5, name: "Dermatology Services", description: "Diagnosis and treatment of skin conditions, including acne, eczema, and skin cancers." },
//   { id: 6, name: "Gynecology", description: "Medical care focusing on women's reproductive health, including routine exams, screenings, and treatment of gynecological conditions." },
//   { id: 7, name: "Emergency Care", description: "Immediate treatment for urgent and life-threatening conditions, including trauma and acute medical crises." },
//   { id: 8, name: "Oncology", description: "Specialized care for cancer patients, including diagnosis, treatment options, and supportive care." },
//   { id: 9, name: "Endocrinology", description: "Medical care focusing on hormonal and metabolic disorders, such as diabetes and thyroid diseases." },
//   { id: 10, name: "Physical Therapy", description: "Rehabilitative services designed to improve physical function and mobility following injury, surgery, or chronic conditions." }
// ];

// // POST: Add new service
// // mock.onPost('/apps/services/add-service').reply(config => {
// //   const { data } = JSON.parse(config.data);

// //   const lastId = Math.max(...serviceList.map(s => s.id), 0);
// //   data.id = lastId + 1;

// //   serviceList.unshift({ ...data });

// //   return [201, { service: data }];
// // });
// mock.onPost('/apps/services/add-service').reply(config => {
//   console.log('Received POST request:', config);

//   try {
//     const { data } = JSON.parse(config.data);
//     console.log('Parsed data:', data);

//     const lastId = Math.max(...serviceList.map(s => s.id), 0);
//     data.id = lastId + 1;

//     serviceList.unshift({ ...data });

//     return [201, { service: data }];
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return [500, { message: 'Internal server error' }];
//   }
// });


// // GET: DATA
// mock.onGet('/apps/services/list').reply(config => {
//   const { q = '' } = config.params ?? '';
//   const queryLowered = q.toLowerCase();

//   const filteredData = serviceList.filter(
//     service =>
//       service.name.toLowerCase().includes(queryLowered) ||
//       service.description.toLowerCase().includes(queryLowered)
//   );

//   return [200, {
//     allData: serviceList,
//     services: filteredData,
//     params: config.params,
//     total: filteredData.length
//   }];
// });

// // DELETE: Deletes Service
// mock.onDelete('/apps/services/delete').reply(config => {
//   const { id } = JSON.parse(config.data);
// console.log(config,'config')
//   console.log('from delete',id)
//   const serviceIndex = serviceList.findIndex(s => s.id === id);
//   if (serviceIndex !== -1) {
//     serviceList.splice(serviceIndex, 1);
//   }

//   return [200];
// });

// // mock.onDelete('/apps/services/delete').reply(config => {
// //   try {
// //     console.log('Incoming config:', config);

// //     // Check if request data exists
// //     if (!config.data) {
// //       console.log('No data found in the request');
// //       return [400, { message: 'No data provided' }];
// //     }

// //     // Parse the request data
// //     let parsedData;
// //     try {
// //       // Ensure that data is a string
// //       parsedData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
// //     } catch (parseError) {
// //       console.error('Error parsing request data:', parseError);
// //       return [400, { message: 'Invalid JSON format' }];
// //     }

// //     const { id } = parsedData;

// //     // Check if ID exists
// //     if (!id) {
// //       console.log('ID is missing in the request');
// //       return [400, { message: 'ID is missing' }];
// //     }

// //     // Find and delete the service
// //     const serviceIndex = serviceList.findIndex(s => s.id === id);

// //     if (serviceIndex === -1) {
// //       console.log(`Service with ID ${id} not found`);
// //       return [404, { message: 'Service not found' }];
// //     }

// //     serviceList.splice(serviceIndex, 1);
// //     console.log(`Service with ID ${id} deleted successfully`);

// //     return [200, { message: 'Service deleted successfully' }];
// //   } catch (error) {
// //     console.error('Error processing the request:', error);
// //     return [500, { message: 'Internal server error' }];
// //   }
// // });






// export { serviceList };



import mock from 'src/@fake-db/mock';

const serviceList = [
  { id: 1, name: "General Check-Up", description: "A routine examination to assess overall health and detect any potential issues early." },
  { id: 2, name: "Pediatric Care", description: "Medical services focused on the health and development of infants, children, and adolescents." },
  { id: 3, name: "Cardiology Consultation", description: "Specialized care for heart-related conditions, including diagnosis and management of cardiovascular diseases." },
  { id: 4, name: "Orthopedic Surgery", description: "Surgical procedures to treat musculoskeletal issues such as fractures, joint disorders, and spinal conditions." },
  { id: 5, name: "Dermatology Services", description: "Diagnosis and treatment of skin conditions, including acne, eczema, and skin cancers." },
  { id: 6, name: "Gynecology", description: "Medical care focusing on women's reproductive health, including routine exams, screenings, and treatment of gynecological conditions." },
  { id: 7, name: "Emergency Care", description: "Immediate treatment for urgent and life-threatening conditions, including trauma and acute medical crises." },
  { id: 8, name: "Oncology", description: "Specialized care for cancer patients, including diagnosis, treatment options, and supportive care." },
  { id: 9, name: "Endocrinology", description: "Medical care focusing on hormonal and metabolic disorders, such as diabetes and thyroid diseases." },
  { id: 10, name: "Physical Therapy", description: "Rehabilitative services designed to improve physical function and mobility following injury, surgery, or chronic conditions." }
];

// POST: Add new service
mock.onPost('/apps/services/add-service').reply(config => {
  console.log('Received POST request:', config);

  try {
    const { data } = JSON.parse(config.data);
    console.log('Parsed data:', data);

    const lastId = Math.max(...serviceList.map(s => s.id), 0);
    data.id = lastId + 1;

    serviceList.unshift({ ...data });

    return [201, { service: data }];
  } catch (error) {
    console.error('Error processing request:', error);

    return [500, { message: 'Internal server error' }];
  }
});

// GET: DATA
mock.onGet('/apps/services/list').reply(config => {
  const { q = '' } = config.params ?? '';
  const queryLowered = q.toLowerCase();

  const filteredData = serviceList.filter(
    service =>
      service.name.toLowerCase().includes(queryLowered) ||
      service.description.toLowerCase().includes(queryLowered)
  );

  return [200, {
    allData: serviceList,
    services: filteredData,
    params: config.params,
    total: filteredData.length
  }];
});

// Post: Edit Service
mock.onPost('/apps/services/edit-service').reply(config => {
  console.log('Received PUT request:', config);

  try {
    const { id, data } = JSON.parse(config.data);
    console.log('Parsed ID:', id, 'Parsed data:', data);

    const serviceIndex = serviceList.findIndex(s => s.id === id);

    if (serviceIndex !== -1) {
      serviceList[serviceIndex] = { ...serviceList[serviceIndex], ...data };

      return [200, { service: serviceList[serviceIndex] }];
    } else {
      return [404, { message: 'Service not found' }];
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return [500, { message: 'Internal server error' }];
  }
});

// GET: Fetch Service by ID
mock.onGet('/apps/services/service').reply(config => {
  const { id } = config.params;
  console.log('Received GET request for ID:', id);

  const service = serviceList.find(s => s.id === parseInt(id, 10));

  if (service) {
    return [200, { service }];
  } else {
    return [404, { message: 'Service not found' }];
  }
});

// DELETE: Deletes Service
mock.onDelete('/apps/services/delete').reply(config => {
  const { id } = JSON.parse(config.data);
  console.log(config, 'config');
  console.log('from delete', id);

  const serviceIndex = serviceList.findIndex(s => s.id === id);
  if (serviceIndex !== -1) {
    serviceList.splice(serviceIndex, 1);
  }

  return [200];
});

export { serviceList };
