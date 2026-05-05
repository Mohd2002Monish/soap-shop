import { Box, Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomNav = () => {
  const location = useLocation();
  const { userInfo } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const openCart = () => {
    // Dispatch a custom event that the Navbar listens to
    window.dispatchEvent(new CustomEvent("open-cart"));
  };

  const navItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "🧼", label: "Shop", path: "/shop" },
    { icon: "🛒", label: "Cart", path: null, onClick: openCart, badge: cartCount },
    { icon: userInfo ? "👤" : "🔑", label: userInfo ? "Profile" : "Sign In", path: userInfo ? "/profile" : "/login" },
  ];

  return (
    <Box
      display={{ base: "flex", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={500}
      bg="rgba(255,248,242,0.96)"
      backdropFilter="blur(20px)"
      style={{ WebkitBackdropFilter: "blur(20px)" }}
      borderTop="1px solid rgba(232,180,184,0.25)"
      boxShadow="0 -4px 20px rgba(232,180,184,0.12)"
    >
      <Flex w="full" justify="space-around" align="center" py={2}>
        {navItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          return (
            <Box
              key={item.label}
              as={item.path ? RouterLink : "div"}
              to={item.path || undefined}
              onClick={item.onClick}
              display="flex"
              flexDir="column"
              alignItems="center"
              gap="2px"
              px={4}
              py="6px"
              position="relative"
              cursor="pointer"
              transition="all 0.2s"
              _active={{ transform: "scale(0.93)" }}
              style={{ textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
            >
              {item.badge > 0 && (
                <Box
                  position="absolute"
                  top="-4px"
                  right="6px"
                  style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }}
                  borderRadius="full"
                  minW="16px"
                  h="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="9px"
                  fontWeight="800"
                  color="white"
                  px="3px"
                >
                  {item.badge}
                </Box>
              )}
              <Text
                fontSize="22px"
                lineHeight={1}
                style={{ filter: isActive ? "none" : "grayscale(30%)" }}
                transition="all 0.2s"
              >
                {item.icon}
              </Text>
              <Text
                fontSize="10px"
                fontWeight={isActive ? "700" : "500"}
                color={isActive ? "var(--pink-dark)" : "gray.400"}
                transition="color 0.2s"
                letterSpacing="0.02em"
              >
                {item.label}
              </Text>
              {isActive && (
                <Box
                  position="absolute"
                  bottom="-6px"
                  left="50%"
                  w="20px"
                  h="3px"
                  borderRadius="full"
                  style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", transform: "translateX(-50%)" }}
                />
              )}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
};

export default BottomNav;
