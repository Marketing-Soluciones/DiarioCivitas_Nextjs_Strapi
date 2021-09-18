import axios from 'axios'

let instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

const queryCategories = {
  query: `query {
    getCategories {
      slug
    }
  }
  `,
  variables: {
  },
}




const api = {
  FetchNews: async (params) => {
    return await instance.get('/posts', {
      params: params
    });
  },

  FetchNews2: async (params) => {
    const queryCategory = {
      query: `mutation {
        getNoticias{
            _id
            slug
            title
        }
      }
      `,
      variables: {
      },
    }
    return await axios.post('http://localhost:3000/api/api', queryCategory, {})
  },

  FetchHome: async (params) => {
    return await instance.get('/toppost', {
      params: params
    })
  },

  FetchCategories: async () => {
    return await axios.post('http://localhost:3000/api/api', queryCategories, {})

  },
  FetchCategory: async (slug) => {
    console.log(slug)
    const queryCategory = {
      query: `mutation {
        getCategory(categorie : "${slug}"){
            _id
            slug
            title
        }
    }
      `,
      variables: {
      },
    }
    return await axios.post('http://localhost:3000/api/api', queryCategory, {})

  },

  Forecast: async (location) => {
    return await axios.get('https://api.m3o.com/v1/weather/Forecast', {
      params: {
        location: location
      },
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY_MICRO}`
      }
    })
  }
}

export { api };