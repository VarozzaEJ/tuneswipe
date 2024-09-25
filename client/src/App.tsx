import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";



function App() {

  return (
    <>
     <div className="App" id="app">
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
    </>
  )
}

export default App
