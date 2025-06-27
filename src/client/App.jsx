import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home.jsx";
import AppBar from "./AppBar.jsx";
import NotFound from "./pages/NotFound.jsx";

/* CARS */
import CarList from "./pages/cars-management/CarList.jsx";
import CarDetail from "./pages/cars-management/CarDetail.jsx";
import CarForm from "./pages/cars-management/CarForm.jsx";

/* INSPECTIONS */
import InspectionList from "./pages/inspections-management/InspectionList.jsx";
import InspectionDetail from "./pages/inspections-management/InspectionDetail.jsx";
import InspectionForm from "./pages/inspections-management/InspectionForm.jsx";

/* PARTS */
import PartList from "./pages/parts-management/PartList.jsx";
import PartDetail from "./pages/parts-management/PartDetail.jsx";
import PartForm from "./pages/parts-management/PartForm.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <div>
        <Toaster />
      </div>
      <AppBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* CARS */}
          <Route path="/cars" element={<CarList />} />
          <Route path="/cars/new" element={<CarForm />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/cars/:id/edit" element={<CarForm />} />

          {/* INSPECTIONS */}
          <Route path="/inspections" element={<InspectionList />} />
          <Route path="/inspections/new" element={<InspectionForm />} />
          <Route path="/inspections/:id" element={<InspectionDetail />} />
          <Route path="/inspections/:id/edit" element={<InspectionForm />} />

          {/* PARTS */}
          <Route path="/parts" element={<PartList />} />
          <Route path="/parts/new" element={<PartForm />} />
          <Route path="/parts/:id" element={<PartDetail />} />
          <Route path="/parts/:partId/edit" element={<PartForm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
