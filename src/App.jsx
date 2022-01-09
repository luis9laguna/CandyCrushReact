import { useState, useEffect } from 'react'
import './App.css'
import blueCandy from './images/blue-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import greenCandy from './images/green-candy.png'
import blank from './images/blank.png'
import ScoreBoard from './components/ScoreBoard'

const width = 8
const colors = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
  greenCandy
]

function App() {

  const [colorArrange, setColorArrange] = useState([])
  const [score, setScore] = useState(0)
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)



  const checkForColumnOfThree = () => {

    for (let i = 0; i <= 47; i++){
      const columnOfThree = [i, i + width, i + width * 2]
      const decidedColor = colorArrange[i]

      const isBlank = colorArrange[i] === blank

      if( columnOfThree.every(square => colorArrange[square] === decidedColor) && !isBlank){
        columnOfThree.forEach(square => colorArrange[square] = blank)
        setScore((oldScore) => oldScore + 3)
        return true
      }
    }
  }

  const checkForColumnOfFour = () => {

    for (let i = 0; i <= 39; i++){
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      const decidedColor = colorArrange[i]

      const isBlank = colorArrange[i] === blank

      if( columnOfFour.every(square => colorArrange[square] === decidedColor) && !isBlank){
        columnOfFour.forEach(square => colorArrange[square] = blank)
        setScore((oldScore) => oldScore + 4)
        return true
      }
    }
  }

  const checkForRowOfThree = () => {

    for (let i = 0; i < 64; i++){
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = colorArrange[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64 ]

      if(notValid.includes(i)) continue
      const isBlank = colorArrange[i] === blank

      if( rowOfThree.every(square => colorArrange[square] === decidedColor) && !isBlank){
        rowOfThree.forEach(square => colorArrange[square] = blank)
        setScore((oldScore) => oldScore + 3)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {

    for (let i = 0; i < 64; i++){
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = colorArrange[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64 ]

      if(notValid.includes(i)) continue
      const isBlank = colorArrange[i] === blank

      if( rowOfFour.every(square => colorArrange[square] === decidedColor) && !isBlank){
        rowOfFour.forEach(square => colorArrange[square] = blank)
        setScore((oldScore) => oldScore + 4)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++){
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && colorArrange[i] === blank){
        let randomNumber = Math.floor(Math.random() * colors.length)
        colorArrange[i] = colors[randomNumber]
      }
      if((colorArrange[i + width]) === blank){
        colorArrange[i + width] = colorArrange[i]
        colorArrange[i] = blank
      }
    }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = (e) => {

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    const validMoves = [
      squareBeingDraggedId -1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    if(validMove){
      colorArrange[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
      colorArrange[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')
    }

    const isAColumnOfFour = checkForColumnOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfFour = checkForRowOfFour()
    const isARowOfThree = checkForRowOfThree() 


    if(squareBeingReplacedId && validMove &&
    (isAColumnOfThree || isAColumnOfFour || isARowOfFour || isARowOfThree)){
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    }else{
      colorArrange[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      colorArrange[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')

      setColorArrange([...colorArrange])
    }
  }



  const createBoard = () =>{
    const randomColorArrange = []
    for (let i = 0; i < width * width; i++) {
      const array = colors[Math.floor(Math.random() * colors.length)]
      randomColorArrange.push(array)
    }
    setColorArrange(randomColorArrange)
  }

  useEffect(() => {
    createBoard()
  }, [])


  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForColumnOfThree()
      checkForRowOfFour()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setColorArrange([...colorArrange])
    }, 100)
    return () => clearInterval(timer)

  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree, moveIntoSquareBelow, colorArrange])


  return (
    <div className="app">
      <div className='game'>
        {colorArrange.map((candyColor, i) => (
          <img
            key={i}
            src={candyColor}
            alt={candyColor}
            data-id={i}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <div>
        <ScoreBoard score={score}/>
      </div>
    </div>
  )
}

export default App
