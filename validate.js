const baseUrl = 'http://localhost:3000';

(async () => {
  try {
    const res = await fetch(baseUrl + '/api/shipments');
    const shipments = await res.json();
    const target = shipments[0];
    if (!target) {
      console.log('No shipments found. Creating one...');
      const createRes = await fetch(baseUrl + '/api/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': 'user_session=%7B%22role%22%3A%22Owner%22%7D' },
        body: JSON.stringify({
          sender_name: 'System Test',
          receiver_name: 'Test Recv',
          phone: '08123',
          origin_city: 'CGK',
          destination_city: 'SUB',
          item_type: 'Test',
          weight: 10,
          price: 500000,
          shipping_status: 'Received',
          vehicle_id: 1
        })
      });
      const createData = await createRes.json();
      console.log('Created:', createData.data.awb);
      return validate(createData.data.awb, createData.data.id);
    }
    
    console.log('Validating existing AWB:', target.awb);
    await validate(target.awb, target.id, target);
  } catch (err) {
    console.error(err);
  }
})();

async function validate(awb, id, target = null) {
  // Update shipment to add a new tracking log
  if (target) {
    console.log('Updating status to Departed...');
    const putRes = await fetch(baseUrl + '/api/update-shipment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Cookie': 'user_session=%7B%22role%22%3A%22Owner%22%7D' },
      body: JSON.stringify({
        id: id,
        sender_name: target.sender_name,
        receiver_name: target.receiver_name,
        phone: target.phone || '0812',
        origin_city: target.origin_city,
        destination_city: target.destination_city,
        item_type: target.item_type,
        weight: target.weight,
        price: target.price,
        shipping_status: 'Departed',
        vehicle_id: target.vehicle_id
      })
    });
    console.log('Update Status:', putRes.status);
  }

  const trackRes = await fetch(baseUrl + '/api/tracking?awb=' + awb);
  const trackData = await trackRes.json();
  
  console.log('\n--- TRACKING RETRIEVAL ---');
  console.log('Found:', trackData.found);
  console.log('Logs count:', trackData.logs ? trackData.logs.length : 0);
  if (trackData.logs) {
    trackData.logs.forEach(l => {
      console.log(`- ${l.status} at ${l.created_at}`);
    });
  }
}
