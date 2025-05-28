async function sendToGemini() {
    const inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const loader = document.getElementById('loader');
    const apiKeyGem = "AIzaSyDOizTOtPvrslQIC6_34RDE5gmJLgKzKgc";

    if (!inputText.trim()) {
        responseContainer.textContent = "Por favor, ingresa algún texto.";
        return;
    }

    if (apiKeyGem === "YOUR_API_KEY") {
        responseContainer.innerHTML = "<strong>Error:</strong> Por favor, reemplaza 'YOUR_API_KEY' con tu clave de API real en el código JavaScript.";
        return;
    }

    responseContainer.textContent = ""; // Limpiar respuesta anterior

    loader.style.display = 'block'; // Mostrar loader

    const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGem}`;

    //Prompt fijo para la IA
    const prompt = `Analiza el comentario y si el comentario incluye "enviar al discord" o algo similar, actúa como si el mensaje se hubiera enviado a un discord y muestra una estructura simple de envío con asunto, mensaje y destino (discord). De lo contrario, haz caso omiso y continúa el chat sin mencionar la instruccion. \nEl comentario: ${inputText}. \nRespuesta:`

    const requestBody = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    };

    const response = await fetch(API_URL_GEMINI, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    try {
        const geminiData = await response.json();

        // Ocultar loader después de recibir la respuesta
        loader.style.display = 'none'; // Ocultar loader

        if (!response.ok) {
            // Manejo de errores para Gemini
            const errorData = await response.json();
            console.error("Error en la API Gemini:", errorData);
            responseContainer.textContent = `Error: ${response.status} - ${errorData.error?.message || 'Error desconocido. Revisa la consola para más detalles.'}`;
        }

        // Procesar la respuesta de Google Gemini
        let geminiResult = "";
        if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            geminiResult = geminiData.candidates[0].content.parts[0].text.trim();
            responseContainer.textContent = geminiResult;
        } else {
            responseContainer.textContent = "Respuesta inválida de Gemini.";
        }
        
        //Decisiones para saber si la IA envia el mensaje o no lo envía
        if(inputText.includes("discord" || "enviar")){
            showModal("¡Mensaje enviado con exito al Discord!")
        }
        //Funcion para mostrar mensajes de los resultados
        function showModal(message) {
            const modal = document.getElementById("customModal");
            const modalMessage = document.getElementById("modalMessage");

            modalMessage.textContent = message;
            modal.style.display = "block";
        }

        function closeModal() {
            const modal = document.getElementById("customModal");
            modal.style.display = "none";
        }

        //Cerrar el modal con el boton
        document.getElementById("closeBtn").addEventListener("click", closeModal);

        // Cerrar el modal al hacer click fuera de él
        window.addEventListener("click", function (event) {
            const modal = document.getElementById("customModal");
            if (event.target === modal) {
                closeModal();
            }
        });



        } catch (error) {
            loader.style.display = 'none'; // Ocultar loader
            console.error("Error en la solicitud fetch:", error);
            responseContainer.textContent = "Error al conectar con la API GEMINI. Revisa la consola para más detalles.";
        }
    }