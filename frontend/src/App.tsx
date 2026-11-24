import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import LoadingState from "@/components/common/LoadingState";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import Experience from "@/pages/Experience";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/admin/Login";

const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const OverviewPanel = lazy(() => import("@/pages/admin/panels/OverviewPanel"));
const ProfilePanel = lazy(() => import("@/pages/admin/panels/ProfilePanel"));
const SocialLinksPanel = lazy(() => import("@/pages/admin/panels/SocialLinksPanel"));
const ResumePanel = lazy(() => import("@/pages/admin/panels/ResumePanel"));
const SkillsPanel = lazy(() => import("@/pages/admin/panels/SkillsPanel"));
const ProjectsPanel = lazy(() => import("@/pages/admin/panels/ProjectsPanel"));
const ExperiencePanel = lazy(() => import("@/pages/admin/panels/ExperiencePanel"));
const EducationPanel = lazy(() => import("@/pages/admin/panels/EducationPanel"));
const CertificatesPanel = lazy(() => import("@/pages/admin/panels/CertificatesPanel"));
const MessagesPanel = lazy(() => import("@/pages/admin/panels/MessagesPanel"));
const SettingsPanel = lazy(() => import("@/pages/admin/panels/SettingsPanel"));

function AdminFallback() {
  return <LoadingState label="Loading admin..." />;
}

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

          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <OverviewPanel />
                  </Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <ProfilePanel />
                  </Suspense>
                }
              />
              <Route
                path="social-links"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <SocialLinksPanel />
                  </Suspense>
                }
              />
              <Route
                path="resume"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <ResumePanel />
                  </Suspense>
                }
              />
              <Route
                path="skills"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <SkillsPanel />
                  </Suspense>
                }
              />
              <Route
                path="projects"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <ProjectsPanel />
                  </Suspense>
                }
              />
              <Route
                path="experience"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <ExperiencePanel />
                  </Suspense>
                }
              />
              <Route
                path="education"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <EducationPanel />
                  </Suspense>
                }
              />
              <Route
                path="certificates"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <CertificatesPanel />
                  </Suspense>
                }
              />
              <Route
                path="messages"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <MessagesPanel />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <SettingsPanel />
                  </Suspense>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PortfolioProvider>
    </AuthProvider>
  );
}

export default App;