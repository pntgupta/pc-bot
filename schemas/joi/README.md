## Example schema

```js
const Joi = require('joi');

module.exports = {
  urlParams: {},
  queryParams: {
    customerId: Joi.number().required(),
    serviceType: Joi.array().min(1),
    startDate: Joi.number()
  }
};
```
