const express = require('express');
const app = express();



app.get('/', (req, res) => {
  res.send(`<div class="division34357" style="height: 386px; width: 341px; outline: rgb(255, 207, 207) dashed 0.5px; box-sizing: border-box; border-radius: 20px; justify-content: center; display: flex; align-items: center; flex-direction: column; border: 3px solid rgb(242, 146, 122); box-shadow: grey 0px 0px 10px;"><div class="division72689" style="height: 116px; width: 145px; outline: rgb(255, 207, 207) dashed 0.5px; box-sizing: border-box; border-radius: 15px; background-image: url(&quot;https://img.freepik.com/premium-photo/fantastic-view-kirkjufellsfoss-waterfall-near-kirkjufell-mountain-sunset_761071-868.jpg?w=2000&quot;); border: 5px solid rgb(64, 153, 229);"></div><h1 class="text89985" style="text-transform: capitalize; margin: 0px;">never expect </h1><p class="paragraph48928" style="margin: 0px; text-align: center; padding: 6px;">Completely orchestrate quality imperatives vis-a-vis functionalized opportunities. Globally administrate flexible data without extensive internal or "organic" sources. Monotonectally productize maintainable convergence and cross-unit initiatives. Rapidiously orchestrate go forward testing procedures whereas flexible web services.</p></div>`);
});

const port = 3001;




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
