export default {
  getIncentives: () => {
    return new Promise((resolve, reject) => {
      fetch(
        'https://cors-anywhere.herokuapp.com/https://api.zanox.com/json/2011-03-01/incentives?connectid=D9D188F49CB8521B5157',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json'
          }
        }
      )
        .then(blob => blob.json())
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
