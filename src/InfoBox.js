import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';
import AnimatedNumber from 'react-animated-number';
import { prettyPrintStat } from './util';

const InfoBox = ({ title, cases, isRed, isBlack, total, active, ...props }) => {
  return (
    <Card
      style={{ cursor: title !== 'Vaccinated' ? 'pointer' : '' }}
      onClick={props.onClick}
      className={`infoBox ${active && 'infoBox--selected'} ${
        isBlack ? 'infoBox--black' : isRed ? 'infoBox--red' : ''
      }`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infoBox__cases">
          <AnimatedNumber
            value={cases}
            duration={
              cases * 0.1 > 3000
                ? 3500
                : cases * 0.1 < 1000
                ? 1500
                : cases * 0.1
            }
            formatValue={(n) => prettyPrintStat(n)}
          />
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          <AnimatedNumber
            value={total}
            duration={
              total * 0.1 > 3000
                ? 3500
                : total * 0.1 < 1000
                ? 1500
                : total * 0.1
            }
            formatValue={(n) => prettyPrintStat(n)}
          />{' '}
          Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
