import { BrowserRouter, Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import Gallery from "./Gallery"
import SiteView from "./SiteView"

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/site/:slug/*" element={<SiteView />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}
