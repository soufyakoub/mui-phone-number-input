import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React, { ImgHTMLAttributes } from "react";
import { CountryCode, countryCodes, data } from "./countries";

export interface FlagProps extends ImgHTMLAttributes<HTMLImageElement> {
  country: CountryCode;
}

const FlagImage = styled.img`
  border-color: rgba(0, 0, 0, 0.1);
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
`;

export function Flag({ country, ...rest }: FlagProps) {
  return (
    <FlagImage
      loading="lazy"
      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country}.svg`}
      width={30}
      alt={data[country]}
      {...rest}
    />
  );
}

Flag.propTypes = {
  country: PropTypes.oneOf(countryCodes),
};
