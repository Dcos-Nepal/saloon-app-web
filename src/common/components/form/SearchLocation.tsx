import { FC, useEffect, useState } from "react";
import { getUuid } from "utils";

declare global {
  interface Window { google: any; }
}

const SearchLocation: FC<any> = ({ label, formikForm, addressPath }) => {
  const rand = getUuid();
  const [autocomplete, setAutocomplete] = useState<any>(null);

  /**
   * 
   * @param place 
   * @returns 
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const preFillAddress = (place: any) => {
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
  };

  useEffect(() => {
    const input = document.getElementById(`location-search-field-${rand}`) as HTMLInputElement;
    const options = {
      componentRestrictions: { country: ["au"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    };

    try {
      setAutocomplete(new window.google.maps.places.Autocomplete(input, options));
    } catch (error) {
      console.log(error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    autocomplete && autocomplete.addListener("place_changed", () => {
      try {
        const place = autocomplete.getPlace();
        preFillAddress(place);
      } catch(ex){
        console.log('Error')
      }
    });
    return () => {
      setAutocomplete(null);
    }
  }, [autocomplete, preFillAddress]);

  return (
    <div className="mb-3">
      {label ? <label htmlFor={"name"} className="form-label txt-dark-grey">{label}</label> : null}
      <input
        type={"text"}
        name={"name"}
        id={`location-search-field-${rand}`}
        className={`form-control`}
        placeholder='Search address here'
      />
    </div>
  );
};

export default SearchLocation;
