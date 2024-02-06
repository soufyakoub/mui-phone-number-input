import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getCountryCallingCode } from "libphonenumber-js";
import PropTypes from "prop-types";
import React, { ReactNode } from "react";
import { Flag } from "./Flag";
import { CountryCode, countryCodes, data } from "./countries";

export interface CountrySelectProps
  extends Omit<SelectProps<CountryCode>, "placeholder"> {
  hideCallingCode?: boolean;
  hideCountryName?: boolean;
  placeholder?: ReactNode;
  onCountryChange?: (country: CountryCode) => void;
}

export function CountrySelect({
  hideCallingCode,
  hideCountryName,
  placeholder,
  onCountryChange,
  ...rest
}: CountrySelectProps) {
  return (
    <Select
      renderValue={(value) => {
        if (!value) return placeholder;

        return (
          <Stack direction="row" alignItems="center">
            <Box width={30}>
              <Flag country={value} />
            </Box>
            {!hideCountryName && <Typography ml={1}>{data[value]}</Typography>}
            {!hideCallingCode && (
              <Typography ml={1} color="gray">
                +{getCountryCallingCode(value)}
              </Typography>
            )}
          </Stack>
        );
      }}
      onChange={(e) => onCountryChange?.(e.target.value as CountryCode)}
      {...rest}
    >
      {countryCodes.map((code) => {
        return (
          <MenuItem key={code} value={code}>
            <Flag country={code} />
            <Typography ml={1}>{data[code]}</Typography>
            <Typography ml={1} color="gray">
              +{getCountryCallingCode(code)}
            </Typography>
          </MenuItem>
        );
      })}
    </Select>
  );
}

CountrySelect.propTypes = {
  hideCallingCode: PropTypes.bool,
  hideCountryName: PropTypes.bool,
  placeholder: PropTypes.node,
  onCountryChange: PropTypes.func,
};
