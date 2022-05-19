import { FC, useCallback, useEffect, useState } from "react";

const SearchLocation: FC<any> = ({ formikForm, addressPath }) => {
  const rand = Math.random();
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const preFillAddress = useCallback((place: any) => {
    let street1 = '';
    let street2 = '';
    let city = '';
    let state = '';
    let postalCode = '';
    let country = '';

    place.address_components.forEach((component: any) => {
      if (component.types.includes('street_number')) {
        street1 = component.long_name;
      }

      if (component.types.includes('route')) {
        street1 = (street1 ? street1 + ' ' : '') + component.short_name;
      }

      if (component.types.includes('locality')) {
        street2 = component.long_name;
      }

      if (component.types.includes('administrative_area_level_2')) {
        city = component.long_name;
      }

      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }

      if (component.types.includes('postal_code')) {
        postalCode = component.long_name;
      }

      if (component.types.includes('country')) {
        country = component.short_name;
      }
    });

    formikForm.setFieldValue(`${addressPath ? addressPath + '.' : ''}street1`, street1);
    formikForm.setFieldValue(`${addressPath ? addressPath + '.' : ''}street2`, street2);
    formikForm.setFieldValue(`${addressPath ? addressPath + '.' : ''}city`, city);
    formikForm.setFieldValue(`${addressPath ? addressPath + '.' : ''}state`, state);
    formikForm.setFieldValue(`${addressPath ? addressPath + '.' : ''}postalCode`, postalCode);
    formikForm.setFieldValue(`${addressPath ? addressPath + '.' : ''}country`, country);
  }, []);

  useEffect(() => {
    const input = document.getElementById("location-search-field" + rand) as HTMLInputElement;
    const options = {
      componentRestrictions: { country: ["au"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    };

    setAutocomplete(new google.maps.places.Autocomplete(input, options));
  }, [])

  useEffect(() => {
    autocomplete && autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      preFillAddress(place);
    });
  }, [autocomplete, preFillAddress]);

  return (
    <div className="mb-3">
      <label htmlFor={"name"} className="form-label txt-dark-grey">Search Address</label>
      <input
        type={"text"}
        name={"name"}
        id={"location-search-field" + rand}
        className={`form-control`}
        placeholder='Search address here'
      />
    </div>
  );
};

export default SearchLocation;
