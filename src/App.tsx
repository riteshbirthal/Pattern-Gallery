import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Gallery } from './routes/Gallery'
import { PatternRoute } from './routes/PatternRoute'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/pattern/:id" element={<PatternRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
