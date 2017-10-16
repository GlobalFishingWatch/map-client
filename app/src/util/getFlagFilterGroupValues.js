import { FLAGS, FLAGS_SHORTCODES, FLAGS_LANDLOCKED } from 'app/src/constants';
import iso3311a2 from 'iso-3166-1-alpha-2';

export default () => {
  const countryNames = [];

  Object.keys(FLAGS)
    .filter(key => FLAGS_LANDLOCKED.indexOf(FLAGS[key]) === -1)
    .forEach((index) => {
      if (iso3311a2.getCountry(FLAGS[index])) {
        const countryCode = FLAGS[index];
        const iconAsciiCodePoints = FLAGS_SHORTCODES[countryCode.toLowerCase()];
        countryNames.push({
          label: iso3311a2.getCountry(countryCode),
          icon: String.fromCodePoint.apply(null, iconAsciiCodePoints),
          id: index
        });
      }
    });

  countryNames.sort((a, b) => {
    if (a.label > b.label) {
      return 1;
    }

    if (b.label > a.label) {
      return -1;
    }

    return 0;
  });

  return countryNames;
};
