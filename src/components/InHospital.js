import React, { useContext } from 'react';
import Output from './Output';
import { SocialContext } from '../context/SocialContext';

function InHospital(props) {
  return (
    <li key={props.hospShort}>
      <Output noArrow={true} {...props} />
    </li>
  );
}

function withInHospital_HOC(Component) {
  const InHospital = ({ hospShort, hospitalName, hosp, icu, ...props }) => {
    const { social } = useContext(SocialContext);
    const kindOfData = 'default'; // set which text to use from SocialTextDict

    const data = {
      value1: hospitalName,
      value2: hosp.number,
      value4: `(${hosp.in}, ${hosp.out})`,
      value6: icu.number,
      value8: `(${icu.in}, ${icu.out})`,
    };

    const newProps = {
      ...props,
      data,
      social,
      kindOfData,
      keyTitle: 'InHospital',
    };

    return <Component {...newProps} />;
  };
  return InHospital;
}
export default withInHospital_HOC(InHospital);
