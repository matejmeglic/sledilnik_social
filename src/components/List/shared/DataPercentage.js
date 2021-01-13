import React from 'react';
import EmbeddedNumber from './EmbeddedNumber';
import Percentage from '../TESTS_ACTIVE/Percentage';

function DataPercentage({ numPositive, numPerformed }) {
  return (
    <>
      <EmbeddedNumber
        className="bold"
        number={numPositive}
        preSign={true}
        suffix=", "
      />
      <EmbeddedNumber
        className="bold"
        number={numPerformed}
        prefix={'testiranih: '}
        suffix={', delež pozitivnih: '}
      />
      <Percentage part={numPositive} total={numPerformed}></Percentage>%
    </>
  );
}

export default DataPercentage;
