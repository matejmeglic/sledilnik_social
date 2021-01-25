import React from 'react';
import Municipalities from '../List/Combined/CITIES_SOCIAL_FRIENDLY/Municipalities';
import trendsLegendDict from '../../trendsLegendDict';
import { LegendSection } from '../Legend';

const LegendTable = ({ data = [{}] }) => {
  const tableBody = data.map(({ description, icon }, i) => {
    const { symbol, attr } = icon;
    const { role, ariaLabel } = attr;
    return (
      <tr key={`${i}-${ariaLabel}`}>
        <td className="table-symbol">
          <span role={role} aria-label={ariaLabel}>
            {symbol}
          </span>
        </td>
        <td className="table-description">{description}</td>
      </tr>
    );
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Simbol</th>
          <th>Opis</th>
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </table>
  );
};

function RatioTrends({ municipalities }) {
  return (
    <>
      <LegendSection
        title={'Trend rasti potrjenih primerov v posamezni občini'}
      >
        <LegendTable data={trendsLegendDict} />
      </LegendSection>
      <LegendSection title={'Formula za izračun trenda'}>
        <p>trend = ( log(y1) + 3 * log(y3) - 4*log(y2) ) / 8</p>
        <p>y1 = vsota novih primerov za dneve (-14..-8)</p>
        <p>y2 = vsota novih primerov za dneve (-10..-4)</p>
        <p>y3 = vsota novih primerov za dneve (-6..0)</p>
      </LegendSection>
      <LegendSection title={'Občine CHECK ratio'}>
        <ul className="municipalities">
          <Municipalities data={municipalities} showTrend="n"></Municipalities>
        </ul>
      </LegendSection>
    </>
  );
}

function withRatioTrendsHOC(Component) {
  return ({ municipalitiesHook, ...props }) => {
    if (municipalitiesHook.isLoading || municipalitiesHook.data === null) {
      return null;
    }

    const data = {
      municipalities: municipalitiesHook.data,
      ...props,
    };

    return <Component {...data} />;
  };
}
export default withRatioTrendsHOC(RatioTrends);