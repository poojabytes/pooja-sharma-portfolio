import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import Experience from "@/pages/Experience";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;
