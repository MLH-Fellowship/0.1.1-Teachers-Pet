// modal to maintain data in memory or in localstorage
// due to time constrains localstorage was not added
class Store {
  constructor(data) {
    this.data = this.parseData(data);
  }

  // parse data before saving
  parseData(data) {
    const destinationData = {};
    const categoryDestinationsMapping = {};
    let seasonCategoriesMapping = {};

    if (data) {
      const { destinations, seasonCategories } = data;
      seasonCategoriesMapping = seasonCategories;

      for (let i = 0; i < destinations.length; i += 1) {
        const item = destinations[i];
        const {
          id, name, country, category,
        } = item;
        destinationData[id] = { id, name, country };
        if (category in categoryDestinationsMapping) {
          categoryDestinationsMapping[category].push(id);
        } else {
          categoryDestinationsMapping[category] = [id];
        }
      }
    }
    return ({
      destinationData,
      categoryDestinationsMapping,
      seasonCategoriesMapping,
    });
  }

  getSeasons() {
    return Object.keys(this.data.seasonCategoriesMapping);
  }

  getCategories(key) {
    if (key && key in this.data.seasonCategoriesMapping) {
      return this.data.seasonCategoriesMapping[key];
    }
    return [];
  }

  getDestinations(key) {
    const destinations = [];
    if (key && key in this.data.categoryDestinationsMapping) {
      const destinationsList = this.data.categoryDestinationsMapping[key];
      for (let i = 0; i < destinationsList.length; i += 1) {
        const dest = this.data.destinationData[destinationsList[i]];
        if (dest) {
          destinations.push(dest);
        }
      }
    }
    return destinations;
  }

  // single destination getter
  getDestinationInfo(id) {
    return (id && id in this.data.destinationData) ? this.data.destinationData[id] : null;
  }
}

export default Store;
