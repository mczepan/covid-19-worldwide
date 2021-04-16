import React from 'react';
import FlagIcon from './FlagIcon';
import './Table.css';

const Table = ({ countries }) => {
  return (
    <div className="table">
      {countries.map(({ country, cases, countryInfo }, index) => (
        <tr key={index}>
          <td>
            <strong>{index + 1}. </strong>
            <FlagIcon code={countryInfo?.iso2?.toLowerCase()} />
            {country}
          </td>
          <td>
            <strong>{cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
