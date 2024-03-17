import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import './style.css';

let chartInstance = null; // Variable to hold the Chart instance

const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState('');
  const [timeRange, setTimeRange] = useState('24h'); // Default time range is 24 hours
  const [error, setError] = useState(null); // State to store error message
  const [temperatureUnit, setTemperatureUnit] = useState('metric'); // Default temperature unit is Celsius
  const [loadingWeather, setLoadingWeather] = useState(false); // State to track weather data loading
  const [loadingForecast, setLoadingForecast] = useState(false); // State to track forecast data loading

  // Mapping of country codes to full names
  const countryNames = {
    AF: 'Afghanistan',
    AX: 'Aland Islands',
    AL: 'Albania',
    DZ: 'Algeria',
    AS: 'American Samoa',
    AD: 'Andorra',
    AO: 'Angola',
    AI: 'Anguilla',
    AQ: 'Antarctica',
    AG: 'Antigua and Barbuda',
    AR: 'Argentina',
    AM: 'Armenia',
    AW: 'Aruba',
    AU: 'Australia',
    AT: 'Austria',
    AZ: 'Azerbaijan',
    BS: 'Bahamas',
    BH: 'Bahrain',
    BD: 'Bangladesh',
    BB: 'Barbados',
    BY: 'Belarus',
    BE: 'Belgium',
    BZ: 'Belize',
    BJ: 'Benin',
    BM: 'Bermuda',
    BT: 'Bhutan',
    BO: 'Bolivia',
    BQ: 'Bonaire, Sint Eustatius and Saba',
    BA: 'Bosnia and Herzegovina',
    BW: 'Botswana',
    BV: 'Bouvet Island',
    BR: 'Brazil',
    IO: 'British Indian Ocean Territory',
    BN: 'Brunei Darussalam',
    BG: 'Bulgaria',
    BF: 'Burkina Faso',
    BI: 'Burundi',
    KH: 'Cambodia',
    CM: 'Cameroon',
    CA: 'Canada',
    CV: 'Cape Verde',
    KY: 'Cayman Islands',
    CF: 'Central African Republic',
    TD: 'Chad',
    CL: 'Chile',
    CN: 'China',
    CX: 'Christmas Island',
    CC: 'Cocos (Keeling) Islands',
    CO: 'Colombia',
    KM: 'Comoros',
    CG: 'Congo',
    CD: 'Congo, Democratic Republic',
    CK: 'Cook Islands',
    CR: 'Costa Rica',
    CI: 'Cote d\'Ivoire',
    HR: 'Croatia',
    CU: 'Cuba',
    CW: 'Curacao',
    CY: 'Cyprus',
    CZ: 'Czech Republic',
    DK: 'Denmark',
    DJ: 'Djibouti',
    DM: 'Dominica',
    DO: 'Dominican Republic',
    EC: 'Ecuador',
    EG: 'Egypt',
    SV: 'El Salvador',
    GQ: 'Equatorial Guinea',
    ER: 'Eritrea',
    EE: 'Estonia',
    ET: 'Ethiopia',
    FK: 'Falkland Islands (Malvinas)',
    FO: 'Faroe Islands',
    FJ: 'Fiji',
    FI: 'Finland',
    FR: 'France',
    GF: 'French Guiana',
    PF: 'French Polynesia',
    TF: 'French Southern Territories',
    GA: 'Gabon',
    GM: 'Gambia',
    GE: 'Georgia',
    DE: 'Germany',
    GH: 'Ghana',
    GI: 'Gibraltar',
    GR: 'Greece',
    GL: 'Greenland',
    GD: 'Grenada',
    GP: 'Guadeloupe',
    GU: 'Guam',
    GT: 'Guatemala',
    GG: 'Guernsey',
    GN: 'Guinea',
    GW: 'Guinea-Bissau',
    GY: 'Guyana',
    HT: 'Haiti',
    HM: 'Heard and McDonald Islands',
    VA: 'Holy See (Vatican City State)',
    HN: 'Honduras',
    HK: 'Hong Kong',
    HU: 'Hungary',
    IS: 'Iceland',
    IN: 'India',
    ID: 'Indonesia',
    IR: 'Iran',
    IQ: 'Iraq',
    IE: 'Ireland',
    IM: 'Isle of Man',
    IL: 'Israel',
    IT: 'Italy',
    JM: 'Jamaica',
    JP: 'Japan',
    JE: 'Jersey',
    JO: 'Jordan',
    KZ: 'Kazakhstan',
    KE: 'Kenya',
    KI: 'Kiribati',
    KP: 'Korea (North)',
    KR: 'Korea (South)',
    KW: 'Kuwait',
    KG: 'Kyrgyzstan',
    LA: 'Lao',
    LV: 'Latvia',
    LB: 'Lebanon',
    LS: 'Lesotho',
    LR: 'Liberia',
    LY: 'Libyan Arab Jamahiriya',
    LI: 'Liechtenstein',
    LT: 'Lithuania',
    LU: 'Luxembourg',
    MO: 'Macao',
    MK: 'Macedonia',
    MG: 'Madagascar',
    MW: 'Malawi',
    MY: 'Malaysia',
    MV: 'Maldives',
    ML: 'Mali',
    MT: 'Malta',
    MH: 'Marshall Islands',
    MQ: 'Martinique',
    MR: 'Mauritania',
    MU: 'Mauritius',
    YT: 'Mayotte',
    MX: 'Mexico',
    FM: 'Micronesia',
    MD: 'Moldova',
    MC: 'Monaco',
    MN: 'Mongolia',
    ME: 'Montenegro',
    MS: 'Montserrat',
    MA: 'Morocco',
    MZ: 'Mozambique',
    MM: 'Myanmar',
    NA: 'Namibia',
    NR: 'Nauru',
    NP: 'Nepal',
    NL: 'Netherlands',
    NC: 'New Caledonia',
    NZ: 'New Zealand',
    NI: 'Nicaragua',
    NE: 'Niger',
    NG: 'Nigeria',
    NU: 'Niue',
    NF: 'Norfolk Island',
    MP: 'Northern Mariana Islands',
    NO: 'Norway',
    OM: 'Oman',
    PK: 'Pakistan',
    PW: 'Palau',
    PS: 'Palestinian Territory',
    PA: 'Panama',
    PG: 'Papua New Guinea',
    PY: 'Paraguay',
    PE: 'Peru',
    PH: 'Philippines',
    PN: 'Pitcairn',
    PL: 'Poland',
    PT: 'Portugal',
    PR: 'Puerto Rico',
    QA: 'Qatar',
    RE: 'Reunion',
    RO: 'Romania',
    RU: 'Russian Federation',
    RW: 'Rwanda',
    BL: 'Saint Barthelemy',
    SH: 'Saint Helena',
    KN: 'Saint Kitts and Nevis',
    LC: 'Saint Lucia',
    MF: 'Saint Martin (French part)',
    PM: 'Saint Pierre and Miquelon',
    VC: 'Saint Vincent and the Grenadines',
    WS: 'Samoa',
    SM: 'San Marino',
    ST: 'Sao Tome and Principe',
    SA: 'Saudi Arabia',
    SN: 'Senegal',
    RS: 'Serbia',
    SC: 'Seychelles',
    SL: 'Sierra Leone',
    SG: 'Singapore',
    SX: 'Sint Maarten (Dutch part)',
    SK: 'Slovakia',
    SI: 'Slovenia',
    SB: 'Solomon Islands',
    SO: 'Somalia',
    ZA: 'South Africa',
    GS: 'South Georgia and the South Sandwich Islands',
    SS: 'South Sudan',
    ES: 'Spain',
    LK: 'Sri Lanka',
    SD: 'Sudan',
    SR: 'Suriname',
    SJ: 'Svalbard and Jan Mayen Islands',
    SZ: 'Swaziland',
    SE: 'Sweden',
    CH: 'Switzerland',
    SY: 'Syrian Arab Republic',
    TW: 'Taiwan',
    TJ: 'Tajikistan',
    TZ: 'Tanzania',
    TH: 'Thailand',
    TL: 'Timor-Leste',
    TG: 'Togo',
    TK: 'Tokelau',
    TO: 'Tonga',
    TT: 'Trinidad and Tobago',
    TN: 'Tunisia',
    TR: 'Turkey',
    TM: 'Turkmenistan',
    TC: 'Turks and Caicos Islands',
    TV: 'Tuvalu',
    UG: 'Uganda',
    UA: 'Ukraine',
    AE: 'United Arab Emirates',
    GB: 'United Kingdom',
    US: 'United States',
    UM: 'United States Minor Outlying Islands',
    UY: 'Uruguay',
    UZ: 'Uzbekistan',
    VU: 'Vanuatu',
    VE: 'Venezuela',
    VN: 'Vietnam',
    VG: 'Virgin Islands (British)',
    VI: 'Virgin Islands (U.S.)',
    WF: 'Wallis and Futuna Islands',
    EH: 'Western Sahara',
    YE: 'Yemen',
    ZM: 'Zambia',
    ZW: 'Zimbabwe',

  };

  // Function to fetch weather data from the API
  const fetchWeatherData = async () => {
    try {
      setLoadingWeather(true); // Start loading weather data
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&appid=651f7aad8ca3d1e2fa31cfcbf29ad4cc`);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoadingWeather(false); // Stop loading weather data
    }
  };

  // Function to fetch forecast data from the API
  const fetchForecastData = async () => {
    try {
      setLoadingForecast(true); // Start loading forecast data
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${temperatureUnit}&appid=651f7aad8ca3d1e2fa31cfcbf29ad4cc`);
      if (forecastResponse.status !== 200) {
        throw new Error(`Failed to fetch forecast data: ${forecastResponse.statusText}`);
      }
      setForecastData(forecastResponse.data.list);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setError('Failed to fetch forecast data. Please try again later.');
    } finally {
      setLoadingForecast(false); // Stop loading forecast data
    }
  };

  useEffect(() => {
    if (forecastData.length > 0) {
      renderChart();
    }
  }, [forecastData, timeRange]);

  // Function to render the temperature chart using Chart.js
  const renderChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = document.getElementById('temperatureChart');
    let displayedForecastData = [];

    // Determine which forecast data to display based on the selected time range
    if (timeRange === '24h') {
      // Display data for the next 24 hours (8 data points, each representing 3 hours)
      displayedForecastData = forecastData.slice(0, 8);
    } else if (timeRange === '7d') {
      // Display data for the past 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      displayedForecastData = forecastData.filter(forecast => new Date(forecast.dt * 1000) >= sevenDaysAgo);
    } else if (timeRange === '30d') {
      // Display data for the past 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      displayedForecastData = forecastData.filter(forecast => new Date(forecast.dt * 1000) >= thirtyDaysAgo);
    }

    // Extract temperatures and dates from the forecast data
    const temperatures = displayedForecastData.map(forecast => convertTemperature(forecast.main.temp));
    const dates = displayedForecastData.map(forecast => new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Create the Chart instance
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Temperature',
          data: temperatures,
          fill: true,
          backgroundColor: 'rgba(05, 392, 392, 0.2)',
          borderColor: 'rgba(05, 392, 392, 1.2)',
          color: 'rgba(105, 392, 392, 0.2)',
          tension: 0.4
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  // Function to convert temperature units
  const convertTemperature = (temp) => {
    if (temperatureUnit === 'imperial') {
      // Convert temperature from Celsius to Fahrenheit
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  // Function to handle city search
  const handleSearch = async () => {
    if (!city) {
      setError('Please enter a city name.'); // Set error message if city is empty
    } else {
      setError(null); // Clear error message if city is provided
      try {
        await fetchWeatherData(); // Wait for weather data to be fetched
        await fetchForecastData(); // Wait for forecast data to be fetched
      } catch (error) {
        setError('Failed to fetch data. Please try again later.'); // Set error message if fetching fails
      }
    }
  };

  // Function to handle using current location
  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to handle input change
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Function to handle key down event
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Call handleSearch when Enter key is pressed
    }
  };

  // Function to handle time range change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // Function to handle successful geolocation
  const geoSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Fetch weather data using geolocation coordinates
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${temperatureUnit}&appid=651f7aad8ca3d1e2fa31cfcbf29ad4cc`)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
      });

    // Fetch forecast data using geolocation coordinates
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${temperatureUnit}&appid=651f7aad8ca3d1e2fa31cfcbf29ad4cc`)
      .then((response) => {
        if (!response.ok) {
          alert("No forecast found.");
          throw new Error("No forecast found.");
        }
        return response.json();
      })
      .then((data) => {
        setForecastData(data.list);
      });
  };

  // Function to handle geolocation error
  const geoError = (error) => {
    console.error(`Error getting location: ${error.message}`);
  };

  return (
    <div className="container">
      <h1>Hello, I am Sky Saga!😎</h1>
      <div className="weather-input">
        <div className="search">
          <input
            className="search-bar"
            type="text"
            value={city}
            placeholder='Enter city name'
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="unit-toggle">
            <label>
              <input type="radio" name="unit" value="metric" checked={temperatureUnit === 'metric'} onChange={() => setTemperatureUnit('metric')} /> Celsius
            </label>
            <label>
              <input type="radio" name="unit" value="imperial" checked={temperatureUnit === 'imperial'} onChange={() => setTemperatureUnit('imperial')} /> Fahrenheit
            </label>
          </div>
          <div className="button-container">
            <button className="search-btn" onClick={handleSearch}>Search</button>
            <button className="location-btn" onClick={handleLocation}>Use Current Location</button>
          </div>
          {error && <p className="error">{error}</p>} {/* Display error message */}
        </div>
      </div>

      <div className="weather-data">
        {loadingWeather || loadingForecast ? ( // Display loading indicator if data is being fetched
          <div className="loading">Loading...</div>
        ) : (
          <>
            {weatherData && (
              <div className="current-weather">
                <h2 className="city">{weatherData.name} ({countryNames[weatherData.sys.country]})</h2>
                <img className="icon" src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Weather Icon"/>
                <p className="temperature">Temperature: {convertTemperature(weatherData.main.temp)}°{temperatureUnit === 'metric' ? 'C' : 'F'}</p>
                <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
                <p className="precipitation">Precipitation: {weatherData.weather[0].main}</p>
                <p className="wind">Wind speed: {weatherData.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}</p>
              </div>
            )}

            <div className="forecast">
              <h3>Temperature Forecast:</h3>
              <canvas id="temperatureChart" width="300" height="200"></canvas>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;
