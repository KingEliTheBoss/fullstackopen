import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.get(baseUrl);
  return response.data;
  
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const edit = async (updatedObject, blogId) => {
  const config = {
    headers: { Authorization: token }
  };
  
  const updateUrl = `${baseUrl}/${blogId}`;
  const response = await axios.put(updateUrl, updatedObject, config);
  return response.data;
};

const remove = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  };
  const removeUrl = `${baseUrl}/${blogId}`;
  const response = await axios.delete(removeUrl, config);
  return response.data;
};

export default { getAll, create, edit, remove, setToken };