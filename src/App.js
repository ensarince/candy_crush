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
  const [squareBeingDragged, setsquareBeingDragged] = useState(null)
  const [squareBeingPlaced, setsquareBeingPlaced] = useState(null)

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
    for (let i = 0; i <= 47  ; i++) {
      //o, 8, 16, 1,9,17 vs vs
      const columnOfThree = [i, i + width, i + width*2]
      const decidedColor = currentColorArrangement[i]
      //if columns of three is equal colors, blank it
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfThree.forEach(square => currentColorArrangement[square] = '')
        return true
      }
    }
  }

  const checkForColumnOfFour = () => {
    //47 çünkü 47. sütündan sonra dikeyde 3lü imkkansız
    for (let i = 0; i <= 39  ; i++) {
      //o, 8, 16, 1,9,17 vs vs
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = currentColorArrangement[i]
      //if columns of three is equal colors, blank it
      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor)) {
        columnOfFour.forEach(square => currentColorArrangement[square] = '')
        return true
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
        return true
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
        return true
      }
    }
  }
  const moveIntoSquareBelow = () =>{
    for (let i = 0; i <= 55; i++) {
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

  const dragStart = (e) => {
    console.log(e.target)
    console.log("drag start")
    setsquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    console.log(e.target)
    console.log("drag drop")
    setsquareBeingPlaced(e.target)
  }

  const dragEnd = (e) => {
    console.log("drag end")
     //get numbers of dragged and placed
    const squareBeingDraggedId =  parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingPlacedId =  parseInt(squareBeingPlaced.getAttribute('data-id'));

    //change dragged and placed squares colors
    currentColorArrangement[squareBeingPlacedId] = squareBeingDragged.style.backgroundColor
    currentColorArrangement[squareBeingDraggedId] = squareBeingPlaced.style.backgroundColor 

    // sadece çevredelileri değiştirebilmek için
    const validMoves = [
      squareBeingDragged - 1,
      squareBeingDragged - width,
      squareBeingDragged + 1,
      squareBeingDragged + width,
    ]

    // alınan kare ile ile koyulan kare arasındaki ilişkiye bak
    const validMove = validMoves.includes(squareBeingPlacedId)

    const isaColumnOfFour = checkForColumnOfFour();
    const isaColumnOfThree = checkForColumnOfThree();
    const isaRowOfFour = checkForRowOfFour();
    const isaRowOfThree = checkForRowOfThree();

    //eğer valid move ise ve grup yapıyorsa, boşla
    if (squareBeingPlacedId && validMove && (isaColumnOfFour || isaColumnOfThree || isaRowOfFour || isaRowOfThree)) {
      setsquareBeingDragged(null)
      setsquareBeingPlaced(null)
      console.log("success")
    }else{
      //geri al
      currentColorArrangement[squareBeingPlacedId] = squareBeingPlaced.style.backgroundColor
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.style.backgroundColor
      setcurrentColorArrangement([...currentColorArrangement]);
      console.log("not success")

    }
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
    }, 100)
    return(() => clearInterval(timer))
  }, [checkForColumnOfThree, checkForRowOfThree, checkForColumnOfFour, checkForRowOfFour, moveIntoSquareBelow, currentColorArrangement])
  

  return(
    <div className="app">
      <div className="game">
          {currentColorArrangement.map((candyColors, index) => (
            <img key={index} 
            src={""}
            style={{backgroundColor : candyColors}}
            data-id={index}
            draggable
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
