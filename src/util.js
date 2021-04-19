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
      <Popup>Test Popup</Popup>
    </Circle>
  ));
