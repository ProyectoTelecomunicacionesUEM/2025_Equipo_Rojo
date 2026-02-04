const enviarDato = async () => {
  const camiones = ["CAMION-ALFA", "CAMION-BETA", "CAMION-GAMMA"];
  const camion = camiones[Math.floor(Math.random() * camiones.length)];
  const temp = (Math.random() * (10 - (-25)) + (-25)).toFixed(1); // Temp entre -25 y 10

  const data = {
    device_id: camion,
    temperature: parseFloat(temp),
    humidity: Math.floor(Math.random() * 50),
    status: temp > 5 ? "ALERTA" : "en_ruta"
  };

  try {
    const res = await fetch("http://localhost:3000/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    console.log(`🚚 ${camion} enviado: ${temp}°C - OK`);
  } catch (e) {
    console.log("Error enviando:", e.message);
  }
};

console.log("🚀 Simulador iniciado. Mandando datos cada 5 seg...");
setInterval(enviarDato, 5000);