import React, { useMemo, useRef, useState } from "react";
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CountriesMenu, { CountriesMenuProps } from "./CountriesMenu";
import { CountryCode, AsYouType, CountryCallingCode, PhoneNumber, getCountries } from "libphonenumber-js";

export type PhoneTextFieldProps = TextFieldProps & {
	/** A map of names to be displayed in the menu for each country code. */
	countryDisplayNames?: Record<CountryCode, string>,
	/** The country that will be selected on first render. */
	initialCountry: CountryCode,
	/** Callback fired when the selected country changes. */
	onCountryChange?: (country: CountryCode, callingCode: CountryCallingCode) => void,
	/** 
	 * Callback fired when the input value changes.
	 * @param phoneNumber - A `PhoneNumber` instance if the input value is a valid phone number,
	 * `undefined` otherwise.
	 */
	onChange?: (phoneNumber?: PhoneNumber) => void
};

function PhoneTextField(props: PhoneTextFieldProps) {
	const {
		initialCountry,
		countryDisplayNames,
		onCountryChange,
		onChange,
		error,
		InputProps,
		...rest
	} = props;

	const [currentCountry, setCurrentCountry] = useState<CountryCode>(initialCountry);
	const [value, setValue] = useState("");

	// This ref is used to get the current value inside a memoized handler.
	const valueRef = useRef("");
	valueRef.current = value;

	const updateValue = (newValue: string, defaultCountry: CountryCode) => {
		const formatter = new AsYouType(defaultCountry);
		const formattedValue = formatter.input(newValue);
		const phoneNumber = formatter.getNumber();

		setValue(formattedValue);

		// Return the phoneNumber instance only when the number is valid for the selected country.
		if (phoneNumber &&
			phoneNumber.country === defaultCountry &&
			phoneNumber.isValid()
		) {
			return phoneNumber;
		}
	};

	const handleMenuItemClick: CountriesMenuProps["onItemClick"] = ({ countryCode, callingCode }) => {
		setCurrentCountry(countryCode);
		const phoneNumber = updateValue(valueRef.current, countryCode);

		if (onCountryChange) {
			onCountryChange(countryCode, callingCode);
		}

		if (onChange) {
			onChange(phoneNumber);
		}
	};

	const _onChange: TextFieldProps["onChange"] = event => {
		const phoneNumber = updateValue(event.target.value, currentCountry);

		if (onChange) {
			onChange(phoneNumber);
		}
	};

	// It seems that InputAdornment and its children get re-rendered unnecessarily
	// even if their props are not changing.
	// So I decided to memoize the result,
	// and use a ref in the handleMenuItemClick function to get the current value.
	const startAdornment = useMemo(() =>
		<InputAdornment position="start">
			<CountriesMenu
				selectedCountry={currentCountry}
				countryDisplayNames={countryDisplayNames}
				onItemClick={handleMenuItemClick}
			/>
		</InputAdornment>,
		[currentCountry, countryDisplayNames]
	);

	return <TextField
		{...rest}
		select={false}
		type="tel"
		value={value}
		error={Boolean(value && error)}
		onChange={_onChange}
		InputProps={{
			...InputProps,
			startAdornment,
		}}
	/>;
}

const countryCodes = getCountries();
const countryDisplayNamesShape = countryCodes.reduce((obj, countryCode) => {
	obj[countryCode] = PropTypes.string;
	return obj;
}, {} as Record<CountryCode, typeof PropTypes.string>);

// If a prop is used inside PhoneTextField
// instead of passing it directly to TextField,
// its corresponding propType should be specified.
PhoneTextField.propTypes = {
	countryDisplayNames: PropTypes.shape(countryDisplayNamesShape),
	initialCountry: PropTypes.oneOf(countryCodes).isRequired,
	onCountryChange: PropTypes.func,
	onChange: PropTypes.func,
	error: PropTypes.bool,
	InputProps: PropTypes.object,
}

export default PhoneTextField;
