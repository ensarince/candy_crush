import React, {useState, useEffect} from "react";

const width = 8
const candyColors = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow',
  
];

const App = () => {

  const [currentColorArrangement, setcurrentColorArrangement] = useState([])
  
  const createBoard = () => {
    //holds 64 rrandom colors 
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      //takes a random num from 0 to 5, then color
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setcurrentColorArrangement(randomColorArrangement);
  }   

  //use to do extra work, like do something after rendering
  useEffect(() => {
    createBoard();
  }, [])

  console.log(currentColorArrangement);

  return(
    <div className="app">
      <div className="game">
          {currentColorArrangement.map((candyColors, index) => (
            <img key={index} 
            style={{backgroundColor : candyColors}}
            />
          ))}
      </div>  
    </div>
  )

}


export default App;
