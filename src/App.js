import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import AppLayout from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import { ContactsPage } from "./pages/ContactsPage";
import { AllProducts } from "./pages/products/AllProducts";
import GetQuote, { QuotesPage } from "./pages/QuotesPage";
import BrandsPage from "./pages/Brands";
import { ProductForm } from "./pages/products/CreateProduct";
import { HomeHero } from "./pages/HomeSection/HomeHero";
import { HomeAbout } from "./pages/HomeSection/HomeAbout";
import { HomeAchievements } from "./pages/HomeSection/HomeAcheivements";
import { HomeReviews } from "./pages/HomeSection/HomeReviews";
import { HomeTestimonialsDetails } from "./pages/HomeSection/HomeTestimonial";
import AboutHero from "./pages/AboutSection/AboutHero";
import AboutOverview from "./pages/AboutSection/AboutOverview";
import AboutCards from "./pages/AboutSection/AboutCards";
import AboutCoreValues from "./pages/AboutSection/AboutCoreValues";
import AboutChooseUs from "./pages/AboutSection/AboutChooseUs";
import AboutCta from "./pages/AboutSection/AboutCta";
import ServiceHome from "./pages/ServiceSection/ServiceHome";
import ServiceHero from "./pages/ServiceSection/ServiceHero";
import ServiceCatalog from "./pages/ServiceSection/ServiceCatalog";
import ServiceSupport from "./pages/ServiceSection/ServiceSupport";
import SupportHero from "./pages/SupportSection/SupportHero";
import SupportCards from "./pages/SupportSection/SupportCards";
import SupportSolutions from "./pages/SupportSection/SupportSolutions";
import SupportLifeCycle from "./pages/SupportSection/SupportLifeCycle";
import SupportFaq from "./pages/SupportSection/SupportFaqs";
import SupportCta from "./pages/SupportSection/SupportCTA";
import { BlogsAdmin } from "./pages/BlogSection/BlogAdmin";
import { BlogHero } from "./pages/BlogSection/BlogHero";
import { BlogList } from "./pages/BlogSection/BlogList";
import { BlogForm } from "./pages/BlogSection/BlogForm";

const ProtectedRoute = ({ children }) =>
  sessionStorage.getItem("token") ? children : <Navigate to="/login" replace />;

const PublicRoute = ({ children }) =>
  sessionStorage.getItem("token") ? <Navigate to="/dashboard" replace /> : children;

const AppRoutes = () => {
  const token = sessionStorage.getItem("token");
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="priciples" element={<BrandsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="quotes" element={<GetQuote />} />
        <Route path="products" element={<AllProducts />} />
        <Route path="addproduct" element={<ProductForm />} />
        <Route path="editproduct/:id" element={<ProductForm />} />
        <Route path="home-hero" element={<HomeHero />} />
        <Route path="home-about" element={<HomeAbout />} />
        <Route path="home-counts" element={<HomeAchievements />} />
        <Route path="home-reviews" element={<HomeReviews />} />
        <Route path="home-details" element={<HomeTestimonialsDetails />} />
        <Route path="about-hero" element={<AboutHero />} />
        <Route path="about-overview" element={<AboutOverview />} />
        <Route path="about-cards" element={<AboutCards />} />
        <Route path="about-corevalues" element={<AboutCoreValues />} />
        <Route path="about-chooseus" element={<AboutChooseUs />} />
        <Route path="about-cta" element={<AboutCta />} />
        <Route path="service-home" element={<ServiceHome/>}/>
        <Route path="service-hero" element={<ServiceHero/>}/>
        <Route path="service-catalog" element={<ServiceCatalog/>}/>
        <Route path="service-support" element={<ServiceSupport/>}/>
        <Route path="support-hero" element={<SupportHero/>}/>
        <Route path="support-cards" element={<SupportCards/>}/>
        <Route path="support-solutions" element={<SupportSolutions/>}/>
        <Route path="support-lifecycle" element={<SupportLifeCycle/>}/>
        <Route path="support-faqs" element={<SupportFaq/>}/>
        <Route path="support-cta" element={<SupportCta/>}/>
        <Route path="blogs" element={<BlogsAdmin/>}/>
        <Route path="blog-hero" element={<BlogHero/>}/>
        <Route path="blog-list" element={<BlogList/>}/>
        <Route path="blog-create" element={<BlogForm/>}/>
      </Route>


      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;