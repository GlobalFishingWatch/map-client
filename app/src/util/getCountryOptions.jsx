import platform from 'platform';
import { FLAGS, FLAGS_SHORTCODES, FLAGS_LANDLOCKED } from 'app/src/constants';
import iso3311a2 from 'iso-3166-1-alpha-2';
import React from 'react';

export default () => {
  const countryNames = [];
  const countryOptions = [];

  Object.keys(FLAGS)
    .filter(key => FLAGS_LANDLOCKED.indexOf(FLAGS[key]) === -1)
    .forEach((index) => {
      if (iso3311a2.getCountry(FLAGS[index])) {
        const countryCode = FLAGS[index];
        const iconAsciiCodePoints = FLAGS_SHORTCODES[countryCode.toLowerCase()];
        countryNames.push({
          name: iso3311a2.getCountry(countryCode),
          icon: String.fromCodePoint.apply(null, iconAsciiCodePoints),
          id: index
        });
      }
    });

  countryNames.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }

    if (b.name > a.name) {
      return -1;
    }

    return 0;
  });

  countryOptions.push(<option key="" value="" >All countries</option >);

  const supportsEmojiFlags =
    ['iOS', 'OS X'].indexOf(platform.os.family) > -1 ||
    platform.os.toString().match('Windows 10');

  countryNames.forEach((country) => {
    const label = (supportsEmojiFlags) ? `${country.name} ${country.icon}` : country.name;
    countryOptions.push(<option key={country.id} value={country.id} >{label}</option >);
  });

  return countryOptions;
};
