import { Outlet } from "react-router-dom";



function App() {

  return (
    <>
     <div className="App" id="app">
      <main>
        <Outlet />
      </main>
    </div>
    </>
  )
}

export default App
