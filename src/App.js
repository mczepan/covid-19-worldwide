import { MenuItem, FormControl, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };

    getCountriesData();
  }, [countries]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setSelectedCountry(countryCode);
  };
  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select
            variant="outlined"
            value={selectedCountry}
            onChange={onCountryChange}
          >
            <MenuItem value={'worldwide'}>Worldwide</MenuItem>
            {countries.map((country, index) => (
              <MenuItem key={index} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* {Header} */}
      {/* {Title + Select input dropdown field} */}

      {/* {InfoBoxes} */}
      {/* {InfoBoxes} */}
      {/* {InfoBoxes} */}

      {/* {Table} */}
      {/* {Graph} */}

      {/* {Map} */}
    </div>
  );
}

export default App;
