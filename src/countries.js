import countries from "./data/countries.json";

export const getCountries = (continent) => {
  try {
    const response = countries.filter((country) => country.continents.includes(continent));
    const formattedResponse = response.map((country) => {
      return {
        name: country.name.common,
        lat: country.latlng[0],
        lng: country.latlng[1],
        capital: country.capital ? country.capital[0] : null,
        population: country.population,
        area: country.area,
        flag: country.flag || country.flags.svg || country.flags.png,
      }
    })
    return formattedResponse;
  } catch (error) {
    console.error("Error getCountries: ", error);
  }
}