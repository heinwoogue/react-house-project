
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import NewHome from "./home/NewHome"

function App() {

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NewHome/>}
        />
        <Route
          path="/*"
          element={<Navigate to="/"/>}
        />
      </Routes>
    </Container>
  )
}

export default App
