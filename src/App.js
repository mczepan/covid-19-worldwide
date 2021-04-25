import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './util';
import FlagIcon from './FlagIcon';
import Tooltip from '@material-ui/core/Tooltip';

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('worldwide');
  const [selectedCountryInfo, setSelectedCountryInfo] = useState({});
  const [
    selectedCountryVaccinatedInfo,
    setSelectedCountryVaccinatedInfo,
  ] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState([53.43, 14.57]);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCountries, setMapCountries] = useState([]);
  const [fullMapCountries, setFullMapCountries] = useState([]);

  const [casesType, setCasesType] = useState('cases');

  const [popupIsOpened, setPopupIsOpened] = useState(false);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    const getCountriesVaccinationData = async () => {
      await fetch(
        `https://disease.sh/v3/covid-19/vaccine/coverage/countries?` +
          new URLSearchParams({
            lastdays: 1,
          })
      )
        .then((response) => response.json())
        .then((data) => {
          const fetchVacinnatedData = data.map((data) => ({
            country: data.country,
            vaccinated: data?.timeline[Object.keys(data.timeline)[0]],
          }));

          let fullMapCountries = mapCountries.map((country) => ({
            ...country,
            vaccinated: fetchVacinnatedData.find(
              (data) => data.country === country.country
            )?.vaccinated,
          }));
          setFullMapCountries(fullMapCountries);
        });
    };

    getCountriesVaccinationData();
  }, [mapCountries]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);

        countryCode === 'worldwide'
          ? setMapCenter([53.43, 14.57])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
        setSelectedCountryInfo(data);
      });

    if (!(countryCode === 'worldwide')) {
      await fetch(
        `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?` +
          new URLSearchParams({
            lastdays: 2,
          })
      )
        .then((response) => response.json())
        .then((data) => {
          setSelectedCountryVaccinatedInfo(data);
        });
    } else {
      setSelectedCountryVaccinatedInfo(null);
    }
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Tooltip title={popupIsOpened ? 'Close country popup first' : ''}>
              <Select
                disabled={popupIsOpened}
                variant="outlined"
                value={selectedCountry}
                onChange={onCountryChange}
              >
                <MenuItem value={'worldwide'}>Worldwide</MenuItem>
                {countries.map((country, index) => (
                  <MenuItem key={index} value={country.value}>
                    <FlagIcon code={country.value?.toLowerCase()} />
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases"
            total={selectedCountryInfo.cases}
            cases={selectedCountryInfo.todayCases}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title="Recoveries"
            total={selectedCountryInfo.recovered}
            cases={selectedCountryInfo.todayRecovered}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            total={selectedCountryInfo.deaths}
            cases={selectedCountryInfo.todayDeaths}
          />

          {selectedCountryVaccinatedInfo?.country && (
            <InfoBox
              title="Vaccinated"
              cases={
                selectedCountryVaccinatedInfo?.timeline[
                  Object.keys(selectedCountryVaccinatedInfo.timeline)[1]
                ] -
                selectedCountryVaccinatedInfo?.timeline[
                  Object.keys(selectedCountryVaccinatedInfo.timeline)[0]
                ]
              }
              total={
                selectedCountryVaccinatedInfo?.timeline[
                  Object.keys(selectedCountryVaccinatedInfo.timeline)[0]
                ] || null
              }
            />
          )}
        </div>
        {fullMapCountries && (
          <Map
            countries={fullMapCountries}
            center={mapCenter}
            zoom={mapZoom}
            casesType={casesType}
            setMapCenter={setMapCenter}
            setSelectedCountryInfo={setSelectedCountryInfo}
            setSelectedCountry={setSelectedCountry}
            setPopupIsOpened={setPopupIsOpened}
          />
        )}
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <br />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
