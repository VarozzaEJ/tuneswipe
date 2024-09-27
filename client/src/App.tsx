import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";



function App() {

  return (
    <>
     <div className="App h-screen" id="app">
      <main className="h-screen">
        <Outlet />
      </main>
      <Toaster />
    </div>
    </>
  )
}

export default App
