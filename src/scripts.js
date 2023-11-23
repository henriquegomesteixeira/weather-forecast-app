// Constantes para as chaves da API e URL base
const apiKey = 'e8da0a9044b6c7188fa6e0fc55909889';

// Elementos do DOM
const cityInput1 = document.querySelector('#search input');
const searchButton1 = document.querySelector('#search Button');
const cityInput2 = document.querySelector('#search2 input');
const searchButton2 = document.querySelector('#search2 button');
const cityName = document.querySelector('#cityName');
const description = document.querySelector('#description');
const date = document.querySelector('#date');
const temp = document.querySelector('#temp');
const wind = document.querySelector('#wind');
const humidity = document.querySelector('#humidity');
const pressure = document.querySelector('#pressure');
const week = document.querySelector('#week');
const figure = document.querySelector('.figure');
const weekTemp = document.querySelectorAll('.weekTemp');
const icon = document.querySelectorAll('.icon');
const weatherContainer = document.querySelector('#weatherContainer');

// Função para obter os dados do clima de hoje
const getWeatherData = async (city) => {
  const apiWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
  const response = await fetch(apiWeatherUrl);
  const data = await response.json();
  return data;
};

// Função para obter os dados da previsão do tempo
const getWeekData = async (city) => {
  const apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br`;
  const response = await fetch(apiWeatherUrl);
  const data = await response.json();
  return data;
};

// Função para mostrar a tela de carregamento
const showLoadingScreen = () => {
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.style.display = 'flex';
};

// Função para esconder a tela de carregamento
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.style.display = 'none';
};

// Função para atualizar a imagem de fundo
const updateBackgroundImage = (city) => {
  const apiUnsplash = 'https://source.unsplash.com/1600x900/?';
  const formattedCity = encodeURIComponent(city);
  weatherContainer.style.backgroundImage = `url(${apiUnsplash + formattedCity})`;
};

// Função para atualizar o ícone de acordo com o clima
const updateWeatherIcon = (iconCode, element) => {
  const solid = 'fa-solid';
  const regular = 'fa-regular';

  const weatherIcons = {
    '01d': `${solid} fa-sun figure`,
    '01n': `${solid} fa-moon firgure`,
    '02d': `${solid} fa-cloud-sun figure`,
    '02n': `${solid} fa-cloud-moon figure`,
    '03d': `${solid} fa-cloud figure`,
    '03n': `${solid} fa-cloud figure`,
    '04d': `${solid} fa-cloud figure`,
    '04n': `${solid} fa-cloud figure`,
    '09d': `${solid} fa-cloud-showers-water figure`,
    '09n': `${solid} fa-cloud-showers-water figure`,
    '10d': `${solid} fa-cloud-sun-rain figure`,
    '10n': `${solid} fa-cloud-moon-rain figure`,
    '11d': `${solid} fa-cloud-bolt figure`,
    '11n': `${solid} fa-cloud-bolt figure`,
    '13d': `${regular} fa-snowflake figure`,
    '13n': `${regular} fa-snowflake figure`,
    '50d': `${solid} fa-smog figure`,
    '50n': `${solid} fa-smog figure`,
  };
  
  element.className = `icon ${weatherIcons[iconCode] || ''}`;
};

// Função para atualizar os dados do clima
const updateCurrentWeatherData = (data) => {
  cityName.innerText = `${data.name}, ${data.sys.country}`;
  description.innerText = data.weather[0].description;
  temp.innerText = `${parseInt(data.main.temp, 10)} °C`;
  wind.innerText = `${data.wind.speed} km/h`;
  humidity.innerText = `${data.main.humidity}%`;
  pressure.innerText = `${data.main.pressure} hPa`;

  updateWeatherIcon(data.weather[0].icon, figure);
};

// Função para atualizar os dados da previsão do tempo
const updateForecastData = async (city) => {
  const weekData = await getWeekData(city);
  const noonTemperatures = weekData.list.filter((item) => item.dt_txt.includes(' 12:00:00'));

  if (noonTemperatures.length > 0) {
    const firstFourTemperatures = noonTemperatures.slice(0, 4);
    firstFourTemperatures.forEach((item, index) => {
      const celsiusTemperature = item.main.temp - 273.15;
      weekTemp[index].innerText = `${parseInt(celsiusTemperature, 10)}°C`;
      updateWeatherIcon(item.weather[0].icon, icon[index]);
    });
  } else {
    console.log('Não há dados para o horário do meio dia.');
  }
};

// Função para atualizar os dias da semana
const updateWeekDays = () => {
  const hoje = new Date();
  const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const weekDayElements = document.querySelectorAll('.weekDay');
  for (let i = 0; i < 4; i += 1) {
    const futureDate = new Date(hoje.getTime() + ((i + 1) * 24 * 60 * 60 * 1000));
    const dayOfWeek = diasDaSemana[futureDate.getDay()];
    weekDayElements[i].textContent = dayOfWeek;
  }
};

// Função para exibir os dados do clima
const showWeatherData = async (city) => {
  // Exibe a tela de carregamento
  showLoadingScreen();
  // Obtém os dados do clima atual usando a função getWeatherData
  const data = await getWeatherData(city);
  
  // Esconde a tela de carregamento após os dados serem carregados
  setTimeout(() => {
    hideLoadingScreen();
  }, 2300);

  // Exibe um alerta de erro caso o nome da cidade não seja encontrado
  if (!data || data.cod === '404') {
    alert('Cidade não encontrada.');
    return;
  }
  // Atualiza as informações na página com os dados obtidos
  updateBackgroundImage(city);
  updateCurrentWeatherData(data);
  await updateForecastData(city);
  updateWeekDays();
};

// Eventos para acionar a exibição dos dados climáticos
// Evento para Desktop - atualizar os dados do clima ao clicar no botão
searchButton1.addEventListener('click', (e) => {
  e.preventDefault();
  const city = cityInput1.value;
  showWeatherData(city);
});

// Evento para Desktop - atualizar os dados do clima ao pressionar a tecla Enter
cityInput1.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const city = cityInput1.value;
    showWeatherData(city);
  }
});

// Evento para mobile - atualizar os dados do clima ao pressionar "Enter" no campo de entrada
cityInput2.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const city = cityInput2.value;
    showWeatherData(city);
  }
});

// Evento para mobile - atualizar os dados do clima ao clicar no botão
searchButton2.addEventListener('click', (e) => {
  e.preventDefault();
  const city = cityInput2.value;
  showWeatherData(city);
});

// Atualiza os dados do clima ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  // Obtém a data atual e a formata para exibição
  const today = new Date();

  // Atualiza o dia da semana
  const options = { weekday: 'long', timeZone: 'America/Sao_Paulo' };
  const dayOfWeek = today.toLocaleDateString('pt-BR', options);
  const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  week.innerText = capitalizedDayOfWeek;

  // Atualiza a data
  const options2 = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' };
  const formattedDate = today.toLocaleDateString('pt-BR', options2);
  date.textContent = formattedDate;
  
  // Chama a função showWeatherData com uma cidade padrão (São Paulo) ao carregar a página
  showWeatherData('São Paulo');
});
