const axios = require('axios');


const OPENWEATHERMAP_API_KEY = 'a9ef1e7ad8015517baa7155e2e3973db';
const ACCUWEATHER_API_KEY = 'up0Ggbp9hzQJ6AstUEJ84O8MH4yNjC7d';


const ciudad = 'Medellín';


// 🌤️ OpenWeatherMap: obtener clima actual
const obtenerClimaDesdeOpenWeather = async () => {
  const inicio = Date.now();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=es`;
  const respuesta = await axios.get(url);
  const data = respuesta.data;

  const fin = Date.now();
  const duracion = fin - inicio;
  return {
    proveedor: 'OpenWeatherMap',
    ciudad: data.name,
    temperatura: data.main.temp,
    descripcion: data.weather[0].description,
    viento: data.wind.speed,
    humedad: data.main.humidity,
    tiempo: duracion
  };
};


const obtenerClimaDesdeAccuWeather = async () => {
  inicio = Date.now();
  const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${ACCUWEATHER_API_KEY}&q=${ciudad}`;
  const locationResp = await axios.get(locationUrl);
  const locationKey = locationResp.data[0].Key;

  const climaUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&language=es&details=true`;
  const climaResp = await axios.get(climaUrl);
  const clima = climaResp.data[0];

  const fin = Date.now();
  const duracion = fin - inicio;

  return {
    proveedor: 'AccuWeather',
    ciudad: locationResp.data[0].LocalizedName,
    temperatura: clima.Temperature.Metric.Value,
    descripcion: clima.WeatherText,
    viento: clima.Wind.Speed.Metric.Value,
    humedad: clima.RelativeHumidity,
    tiempo: duracion
  };
};


async function mostrarClimaMasRapido() {
  try {
    const resultado = await Promise.race([
      obtenerClimaDesdeOpenWeather(),
      obtenerClimaDesdeAccuWeather()
    ]);
    console.log('-----------------------------------');
    console.log(`Resultado más rápido desde ${resultado.proveedor}`);
    console.log(`Ciudad: ${resultado.ciudad}`);
    console.log(`Temperatura: ${resultado.temperatura}°C`);
    console.log(`Descripción: ${resultado.descripcion}`);
    console.log(`Humedad: ${resultado.humedad}%`);
    console.log(`Viento: ${resultado.viento} m/s`);
    console.log(`Tiempo de respuesta: ${resultado.tiempo} ms`);
    console.log('-----------------------------------');
  } catch (error) {
    console.error('Error al obtener el clima:', error.message);
  }
}

mostrarClimaMasRapido();