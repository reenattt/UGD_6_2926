async function test() {
  const res = await fetch('http://localhost:3000/api/shipments');
  const data = await res.json();
  const shipment = data[0];
  console.log('Before:', shipment.updated_at, shipment.created_at);

  // Note: API requires auth, so this might return 401. Let's see.
  console.log("If 401, we know the API requires auth. We can read the DB directly.");
}
test();
