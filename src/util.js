import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
  cases: {
    hex: '#CC1034',
    x: 80 * 2,
  },

  recovered: {
    hex: '#7DD71D',
    x: 120 * 2,
  },

  deaths: {
    hex: '#C0C0C0',
    x: 200 * 2,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => b.cases - a.cases);

  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format('0.0a')}` : '+0';

export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].x}
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">
            <h3>{country.country}</h3>
          </div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format('0,0')}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format('0,0')}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format('0,0')}
          </div>
          <div className="info-vaccinated">
            Vaccinated: {numeral(country.vaccinated).format('0,0')}
          </div>
          <div></div>
        </div>
      </Popup>
    </Circle>
  ));
