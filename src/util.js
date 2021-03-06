import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
	cases: {
		hex: '#CC1034',
		x: 120,
	},

	recovered: {
		hex: '#7DD71D',
		x: 120,
	},

	deaths: {
		hex: '#2a2b2b',
		x: 500,
	},
};

export const sortData = (data) => {
	const sortedData = [...data];

	sortedData.sort((a, b) => b.cases - a.cases);

	return sortedData;
};

export const prettyPrintStat = (stat) =>
	stat ? `+${numeral(stat).format('0.0a')}` : '+0';

export const showDataOnMap = (
	data,
	casesType,
	setSelectedCountryInfo,
	setSelectedCountry,
	setPopupIsOpened,
	setMapCenter
) =>
	data.map((country, index) => (
		<Circle
			key={index}
			center={[country.countryInfo.lat, country.countryInfo.long]}
			fillOpacity={0.4}
			pathOptions={{
				color: casesTypeColors[casesType].hex,
				fillColor: casesTypeColors[casesType].hex,
			}}
			radius={
				(Math.sqrt(country[casesType]) * casesTypeColors[casesType].x) / 3
			}
		>
			<Popup
				onOpen={() => {
					setPopupIsOpened(true);
					setMapCenter([country.countryInfo.lat, country.countryInfo.long]);
					setSelectedCountry(country.countryInfo.iso2);
					setSelectedCountryInfo(country);
				}}
				onClose={() => setPopupIsOpened(false)}
			>
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
