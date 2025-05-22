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

    const requestBody = {
        "contents": [
            {
                "parts": [
                    {
                        "text": inputText
                    }
                ]
            }
        ]
    };

    const requestBody2 = {
        model: "mistral-tiny", // Usando el modelo más pequeño de Mistral
        messages: [
            { role: "user", content: inputText } // El contenido del texto que se quiere procesar
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
        if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
            responseContainer.textContent = geminiData.candidates[0].content.parts[0].text.trim();
        } else {
            responseContainer.textContent = "Respuesta inválida de Gemini.";
        }

        // Procesar la respuesta de Mistral AI
        if (mistralData?.choices?.[0]?.message?.content) {
            responseContainer2.textContent = mistralData.choices[0].message.content.trim();
        } else {
            responseContainer2.textContent = "Respuesta inválida de Mistral.";
        }


    } catch (error) {
        loader.style.display = 'none'; // Ocultar loader
        console.error("Error en la solicitud fetch:", error);
        responseContainer.textContent = "Error al conectar con la API GEMINI. Revisa la consola para más detalles.";
        responseContainer2.textContent = "Error al conectar con la API MISTRAL. Revisa la consola para más detalles.";
    }
}