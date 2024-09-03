export const getCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const countries = data.map((country) => ({
      name: country.name.common,
      latitude: country.latlng[0],
      longitude: country.latlng[1],
      population: country.population,
    }));
    return countries;

    // return data;
  } catch (error) {
    console.error("Error getCountries: ", error);
  }
}