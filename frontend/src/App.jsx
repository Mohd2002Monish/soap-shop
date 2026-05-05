import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import BottomNav from "./components/layout/BottomNav.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="var(--cream)">
      <Navbar />
      {/* pb on mobile reserves space for bottom nav bar */}
      <Box as="main" flex={1} pb={{ base: "65px", md: 0 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Guest-accessible */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />

          {/* Protected — logged-in only */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
      <Footer />
      {/* Mobile bottom navigation — hidden on md+ */}
      <BottomNav />
    </Box>
  );
}

export default App;
