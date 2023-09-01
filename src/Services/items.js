import axios from 'axios';

export const fetchItems = async () => {
  try {
    const response = await axios.get('/api/items');
    console.log(response)
    return response?.data;
  } catch (error) {
    console.error(error);
  }
};


export const updatePrice= async(updatedPrices) => {
  try {
    const response = await axios.put('/api/items',{updatedPrices});
    console.log(response)
    return response?.data;
  } catch (error) {
    console.error(error);
  }
};


