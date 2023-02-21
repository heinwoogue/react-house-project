
import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import NewHomeForm from "./home/NewHomeForm"

function App() {

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NewHomeForm/>}
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
