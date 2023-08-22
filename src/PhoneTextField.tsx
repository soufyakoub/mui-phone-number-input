import styled from "@emotion/styled";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AsYouType, parseIncompletePhoneNumber } from "libphonenumber-js";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { CountrySelect, CountrySelectProps } from "./CountrySelect";
import { CountryCode, countryCodes } from "./countries";

export type PhoneTextFieldProps = TextFieldProps & {
  country?: CountryCode;
  hideSelect?: boolean;
  disableFormatting?: boolean;
  onCountryChange?: (country: CountryCode) => void;
  onPhoneNumber?: (value: string) => void;
};

const StyledCountrySelect = styled(CountrySelect)`
  fieldset {
    display: none;
  }

  .MuiSelect-select {
    padding: 8px;
  }
`;

export function PhoneTextField({
  country,
  hideSelect,
  disableFormatting,
  onCountryChange,
  onPhoneNumber,
  ...rest
}: PhoneTextFieldProps) {
  const [value, setValue] = useState("");

  const update = (value: string, country?: CountryCode) => {
    value = parseIncompletePhoneNumber(value);
    const asYouType = new AsYouType(country);
    const formatted = asYouType.input(value);
    let phoneNumber = asYouType.getNumber();

    if (
      phoneNumber &&
      (!country || phoneNumber.country === country) &&
      phoneNumber.isValid()
    ) {
      onPhoneNumber?.(phoneNumber.number);
    } else {
      onPhoneNumber?.("");
    }

    setValue(disableFormatting ? value : formatted);
  };

  return (
    <TextField
      InputProps={{
        startAdornment: country && !hideSelect && (
          <StyledCountrySelect
            variant="outlined"
            size={rest.size}
            hideCallingCode
            hideCountryName
            value={country}
            onCountryChange={(country) => {
              onCountryChange?.(country);
              update(value, country);
            }}
          />
        ),
      }}
      {...rest}
      value={value}
      onChange={(e) => update(e.target.value, country)}
    />
  );
}

PhoneTextField.propTypes = {
  country: PropTypes.oneOf(countryCodes),
  hideSelect: PropTypes.bool,
  disableFormatting: PropTypes.bool,
  onCountryChange: PropTypes.func,
  onPhoneNumber: PropTypes.func,
};
