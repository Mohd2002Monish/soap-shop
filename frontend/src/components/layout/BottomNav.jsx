import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const BottomNav = () => {
  const location = useLocation();
  const { userInfo } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [pressedKey, setPressedKey] = useState(null);

  const openCart = () => {
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
      bg="rgba(255,248,242,0.97)"
      backdropFilter="blur(24px)"
      style={{ WebkitBackdropFilter: "blur(24px)" }}
      borderTop="1px solid rgba(232,180,184,0.25)"
      boxShadow="0 -6px 24px rgba(232,180,184,0.14)"
      pb="env(safe-area-inset-bottom, 0px)"
    >
      <Flex w="full" justify="space-around" align="center" py="8px">
        {navItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          return (
            <Box
              key={item.label}
              as={item.path ? RouterLink : "div"}
              to={item.path || undefined}
              onClick={() => {
                setPressedKey(item.label);
                setTimeout(() => setPressedKey(null), 300);
                item.onClick?.();
              }}
              display="flex"
              flexDir="column"
              alignItems="center"
              gap="3px"
              px={4}
              py="8px"
              minW="60px"
              position="relative"
              cursor="pointer"
              transition="all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
              transform={pressedKey === item.label ? "scale(0.88)" : isActive ? "scale(1.05)" : "scale(1)"}
              style={{ textDecoration: "none", WebkitTapHighlightColor: "transparent" }}
            >
              {/* Active indicator pill */}
              {isActive && (
                <Box
                  position="absolute"
                  top="4px"
                  left="50%"
                  w="32px"
                  h="32px"
                  borderRadius="full"
                  bg="rgba(232,180,184,0.15)"
                  style={{
                    transform: "translateX(-50%)",
                    animation: "scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />
              )}

              {/* Cart badge */}
              {item.badge > 0 && (
                <Box
                  position="absolute"
                  top="2px"
                  right="8px"
                  style={{
                    background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)",
                    animation: "bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
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
                  zIndex={1}
                >
                  {item.badge > 9 ? "9+" : item.badge}
                </Box>
              )}

              <Text
                fontSize="22px"
                lineHeight={1}
                position="relative"
                zIndex={1}
                style={{
                  filter: isActive ? "none" : "grayscale(20%)",
                  transition: "all 0.2s",
                  display: "block",
                }}
              >
                {item.icon}
              </Text>
              <Text
                fontSize="10px"
                fontWeight={isActive ? "700" : "500"}
                color={isActive ? "var(--pink-dark)" : "gray.400"}
                transition="all 0.2s"
                letterSpacing="0.02em"
                position="relative"
                zIndex={1}
              >
                {item.label}
              </Text>

              {/* Active underline dot */}
              {isActive && (
                <Box
                  position="absolute"
                  bottom="-1px"
                  left="50%"
                  w="4px"
                  h="4px"
                  borderRadius="full"
                  style={{
                    background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)",
                    transform: "translateX(-50%)",
                    animation: "scaleIn 0.3s ease",
                  }}
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
