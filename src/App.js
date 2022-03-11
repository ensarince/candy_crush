import { clear } from "@testing-library/user-event/dist/clear";
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

  const checkForColumnOfThree = () => {
    //47 çünkü 47. sütündan sonra dikeyde 3lü imkkansız
    for (let i = 0; i < 47  ; i++) {
      //o, 8, 16, 1,9,17 vs vs
      const columnOfThree = [i, i + width, i + width*2]
      const decidedColor = currentColorArrangement[i]
      //if columns of three is equal colors, blank it
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfThree.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }

  const checkForColumnOfFour = () => {
    //47 çünkü 47. sütündan sonra dikeyde 3lü imkkansız
    for (let i = 0; i < 39  ; i++) {
      //o, 8, 16, 1,9,17 vs vs
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      //if columns of three is equal colors, blank it
      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfFour.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64  ; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i]
      //dont check these ones
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
      if (notValid.includes(i)) continue   
    
      //if columns of three is equal colors, blank it
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        rowOfThree.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64  ; i++) {
      const rowOfFour = [i, i + 1, i + 2, i+3]
      const decidedColor = currentColorArrangement[i]
      //dont check these ones
      const notValid = [5, 6,7, 13, 14,15, 21, 22,23, 29, 30,31,37,38,39, 45, 46,47, 53, 54,55, 62, 63,64]
      if (notValid.includes(i)) continue   
    
      //if columns of three is equal colors, blank it
      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        rowOfFour.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }
  const moveIntoSquareBelow = () =>{
    for (let i = 0; i < 64 - width; i++) {
      //when top rows emptied again, check them and assign random color to them again
      const firstRow = [0,1,2,3,4,5,6,7]
      const isFirstRow = firstRow.includes(i)
      if (isFirstRow && currentColorArrangement[i] === '') {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }
      //bi karenin aşağısı boş ise
      if (currentColorArrangement[i + width] == '') {
        //o kareye o rengi at
        currentColorArrangement[i + width] = currentColorArrangement[i]
        //ve üstteki tekrar boş olur
        currentColorArrangement[i] = ''
      }
    }
  }

  const dragStart = () => {
    console.log("drag srart")
  }

  const dragDrop = () => {
    console.log("drag drop")
  }

  const dragEnd = () => {
    console.log("drag end")
  }

  //create board once
  useEffect(() => {
    createBoard();
  }, [])

  //first time run the cCA method, than run it every 100ms. 
  useEffect(() => {
    const timer = setInterval(() =>{
      checkForColumnOfThree();
      checkForColumnOfFour();
      checkForRowOfThree();
      checkForRowOfFour();
      moveIntoSquareBelow();
      setcurrentColorArrangement([...currentColorArrangement])
    }, 1000)
    return(() => clearInterval(timer))
  }, [checkForColumnOfThree, checkForRowOfThree, checkForColumnOfFour, checkForRowOfFour, moveIntoSquareBelow, currentColorArrangement])
  

  return(
    <div className="app">
      <div className="game">
          {currentColorArrangement.map((candyColors, index) => (
            <img key={index} 
            style={{backgroundColor : candyColors}}
            data-id={index}
            draggable={true}
            onDragStart = {dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrag = {(e) => e.preventDefault()}
            onDragLeave = {(e) => e.preventDefault()}
            onDrop = {dragDrop}
            onDragEnd = {dragEnd}
            />
          ))}
      </div>  
    </div>
  )

}


export default App;
