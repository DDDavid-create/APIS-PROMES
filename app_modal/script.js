async function sendToGemini() {
    const inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const responseContainer2 = document.getElementById('responseContainer2');
    const loader = document.getElementById('loader');
    const apiKeyGem = "AIzaSyDOizTOtPvrslQIC6_34RDE5gmJLgKzKgc";
    const apiKeyMis = "fPmNMAc00ZKDgMVPChhT3iD4f1pYci53";

    if (!inputText.trim()) {
        responseContainer.textContent = "Por favor, ingresa algún texto.";
        return;
    }

    if (apiKeyGem === "YOUR_API_KEY") {
        responseContainer.innerHTML = "<strong>Error:</strong> Por favor, reemplaza 'YOUR_API_KEY' con tu clave de API real en el código JavaScript.";
        return;
    } else if (apiKeyMis === "YOUR_API_KEY") {
        responseContainer2.innerHTML = "<strong>Error:</strong> Por favor, reemplaza 'YOUR_API_KEY' con tu clave de API real en el código JavaScript.";
        return;
    }

    responseContainer.textContent = ""; // Limpiar respuesta anterior
    responseContainer2.textContent = ""; // Limpiar respuesta anterior

    loader.style.display = 'block'; // Mostrar loader

    const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGem}`;
    const API_URL_MISTRAL = `https://api.mistral.ai/v1/chat/completions`;

    //Prompt fijo para ambas IA's
    const prompt = `Analiza el siguiente comentario y clasifícalo como "positivo", "negativo" o "neutro", no des explicaciones solo la respuesta. \nComentario: "${inputText}"\nRespuesta:`;

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

    const requestBody2 = {
        model: "mistral-tiny", // Usando el modelo más pequeño de Mistral
        messages: [
            { role: "user", content: prompt } // El contenido del texto que se quiere procesar
        ]
    };

    const response = await fetch(API_URL_GEMINI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    const response2 = await fetch(API_URL_MISTRAL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${apiKeyMis}`
        },
        body: JSON.stringify(requestBody2)
    });

    try {
        const [geminiData, mistralData] = await Promise.all([response.json(), response2.json()]);

        loader.style.display = 'none'; // Ocultar loader

        if (!response.ok || !response2.ok) {
            // Manejo de errores para Gemini
            const errorData = await response.json();
            console.error("Error en la API Gemini:", errorData);
            responseContainer.textContent = `Error: ${response.status} - ${errorData.error?.message || 'Error desconocido. Revisa la consola para más detalles.'}`;

            // Manejo de errores para Mistral
            const errorData2 = await response2.json();
            console.error("Error en la API Mistral:", errorData2);
            responseContainer2.textContent = `Error: ${response2.status} - ${errorData2.error?.message || 'Error desconocido. Revisa la consola para más detalles.'}`;
            return;
        }

        // Procesar la respuesta de Google Gemini
        let geminiResult = "";
        if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            geminiResult = geminiData.candidates[0].content.parts[0].text.trim();
            responseContainer.textContent = geminiResult;
        } else {
            responseContainer.textContent = "Respuesta inválida de Gemini.";
        }

        // Procesar la respuesta de Mistral AI
        let mistralResult = "";
        if (mistralData?.choices?.[0]?.message?.content) {
            mistralResult = mistralData.choices[0].message.content.trim();
            responseContainer2.textContent = mistralResult;
        } else {
            responseContainer2.textContent = "Respuesta inválida de Mistral.";
        }

        //Funcion para mostrar mensajes de los resultados
        function showModal(message) {
            const modal = document.getElementById("customModal");
            const modalMessage = document.getElementById("modalMessage");

            modalMessage.textContent = message;
            modal.style.display = "block";
        }

        function closeModal() {
            const modal = document.getElementById("customModal")
            modal.style.display = "none";
        }

        //Funcion para cerrar el modal al hacer click en el botón de cerrar
        const closeButton = document.querySelector(".close");
        closeButton.addEventListener("click", function () {
            closeModal();
        });

        // Cerrar el modal al hacer click fuera de él
        window.addEventListener("click", function (event) {
            const modal = document.getElementById("customModal");
            if (event.target === modal) {
                closeModal();
            }
        });

            //Decisiones si la respuesta es positiva, negativa o neutra
            if (geminiResult == "positivo" || mistralResult == "positivo") {
                showModal("El comentario es positivo.");
            } else if (geminiResult == "negativo" || mistralResult == "negativo") {
                showModal("El comentario es negativo.");
            } else if (geminiResult == "neutro" || mistralResult == "neutro") {
                showModal("El comentario es neutro.");
            } else {
                showModal("No se pudo clasificar el comentario. Ya que hay disrupcion entre las IA's.");
            }


        } catch (error) {
            loader.style.display = 'none'; // Ocultar loader
            console.error("Error en la solicitud fetch:", error);
            responseContainer.textContent = "Error al conectar con la API GEMINI. Revisa la consola para más detalles.";
            responseContainer2.textContent = "Error al conectar con la API MISTRAL. Revisa la consola para más detalles.";
        }
    }