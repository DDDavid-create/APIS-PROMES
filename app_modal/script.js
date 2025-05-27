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
    const prompt = `Analiza el siguiente comentario y clasifícalo como "positivo", "negativo" o "neutro", no me des explicaciones solo la respuesta. \nComentario: "${inputText}"\nRespuesta:`;

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

        // Cerrar el modal al hacer click fuera de él
        window.addEventListener("click", function (event) {
            const modal = document.getElementById("customModal");
            if (event.target === modal) {
                closeModal();
            }
        });

            //Decisiones si la respuesta es positiva, negativa o neutra
            if (geminiResult.toLocaleLowerCase() == "positivo") {
                showModal("El comentario es positivo.");
            } else if (geminiResult.toLocaleLowerCase() == "negativo") {
                showModal("El comentario es negativo.");
            } else if (geminiResult.toLocaleLowerCase() == "neutro") {
                showModal("El comentario es neutro.");
            } else {
                showModal("No se pudo clasificar el comentario.");
            }


        } catch (error) {
            loader.style.display = 'none'; // Ocultar loader
            console.error("Error en la solicitud fetch:", error);
            responseContainer.textContent = "Error al conectar con la API GEMINI. Revisa la consola para más detalles.";
        }
    }