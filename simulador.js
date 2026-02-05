const TOTAL_CAMIONES = 200;

// Función para crear una pequeña pausa
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const enviarDato = async () => {
  console.log("--- Iniciando ciclo de 200 camiones ---");
  
  for (let i = 1; i <= TOTAL_CAMIONES; i++) {
    const camionId = `CAMION-${i.toString().padStart(3, '0')}`; // Usamos padStart(3) para llegar a 200 bien (001, 002...)
    const temp = (Math.random() * (10 - (-25)) + (-25)).toFixed(1);

    const data = {
      device_id: camionId,
      temperature: parseFloat(temp),
      status: temp > 5 ? "ALERTA" : "en_ruta"
    };

    try {
      const res = await fetch("http://localhost:3000/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        console.log(`✅ [${camionId}] Insertado`);
      } else {
        console.log(`❌ [${camionId}] Error`);
      }
    } catch (e) {
      console.log(`🚨 Error conexión en ${camionId}`);
    }

    // 🔥 LA CLAVE: Espera 50 milisegundos entre cada camión para no saturar
    await esperar(50); 
  }
  
  console.log("--- Ciclo completado. Esperando al siguiente intervalo... ---");
};

// Como enviar 200 camiones con pausa tarda unos 10-15 seg, subimos el intervalo a 30 seg
setInterval(enviarDato, 30000);
enviarDato(); // Primera ejecución inmediata