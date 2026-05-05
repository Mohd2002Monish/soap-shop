import { useState, useEffect } from "react";
import {
  Box, Flex, Text, Button, IconButton, useDisclosure, useToast,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  DrawerCloseButton, Image, VStack, HStack, Divider, Badge, Avatar,
  Menu, MenuButton, MenuList, MenuItem, Stack
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import { removeItem, updateQty, clearCart } from "../../store/slices/cartSlice.js";
import { getGuestId } from "../../utils/guestSession.js";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const guestId = getGuestId();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for cart open event from BottomNav
  useEffect(() => {
    const handleOpenCart = () => onOpen();
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, [onOpen]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const copyGuestId = () => {
    if (guestId) {
      navigator.clipboard.writeText(guestId);
      toast({ title: "Session ID copied!", description: "Use this ID at checkout to sync your cart after login.", status: "success", duration: 3000 });
    }
  };

  return (
    <>
      <Box
        className="navbar"
        px={{ base: 4, md: 8 }}
        py={4}
        style={{
          boxShadow: scrolled ? "0 4px 30px rgba(232,180,184,0.15)" : "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
          {/* Logo */}
          <RouterLink to="/">
            <Flex align="center" gap={2}>
              <Box
                w={9} h={9} borderRadius="full"
                style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)" }}
                display="flex" alignItems="center" justifyContent="center"
              >
                <Text fontSize="lg">🌿</Text>
              </Box>
              <Text
                fontFamily="'Playfair Display', serif"
                fontSize="xl"
                fontWeight="700"
                style={{
                  background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Sterling Botanica
              </Text>
            </Flex>
          </RouterLink>

          {/* Nav Links */}
          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {[["Home", "/"], ["Shop", "/shop"], ["About", "/#about"], ["Why Us", "/#benefits"]].map(([label, href]) => (
              <Box
                key={label}
                as={href.startsWith("#") ? "a" : RouterLink}
                href={href.startsWith("#") ? href : undefined}
                to={href.startsWith("/") ? href : undefined}
                fontSize="sm"
                fontWeight="500"
                color="var(--brown)"
                position="relative"
                _hover={{ color: "var(--pink-dark)" }}
                transition="color 0.2s"
                cursor="pointer"
                sx={{
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: "-4px",
                    left: 0,
                    width: 0,
                    height: "2px",
                    background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)",
                    borderRadius: "full",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": { width: "100%" },
                }}
              >
                {label}
              </Box>
            ))}
          </HStack>

          {/* Right Actions */}
          <HStack spacing={3}>
            {/* Cart Button */}
            <Box position="relative">
              <Button
                onClick={onOpen}
                variant="ghost"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="600"
                color="var(--brown)"
                _hover={{ bg: "rgba(232,180,184,0.1)" }}
                leftIcon={<Text>🛒</Text>}
              >
                Cart
              </Button>
              {cartCount > 0 && (
                <Box
                  className="cart-badge"
                  style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)" }}
                >
                  {cartCount}
                </Box>
              )}
            </Box>

            {/* Auth */}
            {userInfo ? (
              <Menu>
                <MenuButton>
                  <Avatar size="sm" name={userInfo.name} bg="var(--pink)" color="white" cursor="pointer" />
                </MenuButton>
                <MenuList borderRadius="xl" border="1px solid rgba(232,180,184,0.3)" shadow="xl" p={2}>
                  <MenuItem borderRadius="lg" fontWeight="500" as={RouterLink} to="/profile">My Profile</MenuItem>
                  <MenuItem borderRadius="lg" fontWeight="500" as={RouterLink} to="/orders">Order History</MenuItem>
                  <Divider my={1} />
                  <MenuItem borderRadius="lg" fontWeight="500" color="red.400" onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Flex gap={2}>
                {!userInfo && guestId && (
                  <Button
                    size="sm"
                    variant="ghost"
                    fontSize="xs"
                    color="gray.400"
                    onClick={copyGuestId}
                    title="Copy your session ID"
                  >
                    #{guestId.slice(-6)}
                  </Button>
                )}
                <Button
                  as={RouterLink}
                  to="/login"
                  size="sm"
                  style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)", color: "white", borderRadius: "50px" }}
                  _hover={{ transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(232,180,184,0.4)" }}
                  transition="all 0.3s ease"
                  fontWeight="600"
                >
                  Sign In
                </Button>
              </Flex>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Cart Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={{ base: "full", md: "md" }}>
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent borderRadius={{ base: 0, md: "24px 0 0 24px" }} bg="var(--cream)" maxW={{ base: "100%", md: "420px" }}>
          <DrawerCloseButton top={5} right={5} borderRadius="full" bg="rgba(232,180,184,0.15)" />
          <DrawerHeader
            borderBottom="1px solid rgba(232,180,184,0.2)"
            pb={4}
            fontFamily="'Playfair Display', serif"
          >
            <Flex align="center" gap={2}>
              <Text>🛒</Text>
              <Text>Your Cart</Text>
              {cartCount > 0 && (
                <Badge
                  style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)", color: "white" }}
                  borderRadius="full" px={2}
                >
                  {cartCount}
                </Badge>
              )}
            </Flex>
          </DrawerHeader>

          <DrawerBody py={6}>
            {items.length === 0 ? (
              <Flex direction="column" align="center" justify="center" h="full" gap={4}>
                <Text fontSize="5xl">🧼</Text>
                <Text fontWeight="600" fontSize="lg" fontFamily="'Playfair Display', serif">Your cart is empty</Text>
                <Text color="gray.400" textAlign="center" fontSize="sm">Add some beautiful soaps to start your self-care journey!</Text>
                <Button
                  onClick={onClose}
                  style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)", color: "white", borderRadius: "50px" }}
                  _hover={{ transform: "translateY(-1px)", boxShadow: "0 8px 25px rgba(232,180,184,0.4)" }}
                  transition="all 0.3s ease"
                >
                  Browse Soaps
                </Button>
              </Flex>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <Box
                    key={item._id}
                    bg="white"
                    borderRadius="16px"
                    p={4}
                    border="1px solid rgba(232,180,184,0.2)"
                  >
                    <Flex gap={3} align="center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        w="70px"
                        h="70px"
                        objectFit="cover"
                        borderRadius="12px"
                        flexShrink={0}
                      />
                      <Box flex={1} minW={0}>
                        <Text fontWeight="600" fontSize="sm" noOfLines={1}>{item.name}</Text>
                        <Text color="var(--pink-dark)" fontWeight="700" fontSize="sm">₹{item.price}</Text>
                        <Flex align="center" mt={2} gap={2}>
                          <IconButton
                            icon={<Text>−</Text>}
                            size="xs"
                            borderRadius="full"
                            bg="rgba(232,180,184,0.2)"
                            border="none"
                            onClick={() => item.quantity === 1
                              ? dispatch(removeItem(item._id))
                              : dispatch(updateQty({ id: item._id, quantity: item.quantity - 1 }))}
                          />
                          <Text fontSize="sm" fontWeight="600" minW="20px" textAlign="center">{item.quantity}</Text>
                          <IconButton
                            icon={<Text>+</Text>}
                            size="xs"
                            borderRadius="full"
                            bg="rgba(232,180,184,0.2)"
                            border="none"
                            onClick={() => dispatch(updateQty({ id: item._id, quantity: item.quantity + 1 }))}
                          />
                        </Flex>
                      </Box>
                      <Box textAlign="right">
                        <Text fontWeight="700" fontSize="sm">₹{item.price * item.quantity}</Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          color="red.300"
                          fontSize="xs"
                          mt={1}
                          onClick={() => dispatch(removeItem(item._id))}
                          borderRadius="full"
                        >
                          Remove
                        </Button>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>

          {items.length > 0 && (
            <Box
              p={6}
              borderTop="1px solid rgba(232,180,184,0.2)"
              bg="white"
              borderRadius="0 0 0 24px"
            >
              <Flex justify="space-between" mb={4} fontWeight="700" fontSize="lg">
                <Text>Total</Text>
                <Text style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>₹{cartTotal}</Text>
              </Flex>
              <VStack spacing={2}>
                <Button
                  as={RouterLink}
                  to="/checkout"
                  onClick={onClose}
                  w="full"
                  size="lg"
                  borderRadius="full"
                  style={{ background: "linear-gradient(135deg, #E8B4B8, #CDB4DB)", color: "white" }}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
                  transition="all 0.3s ease"
                  fontWeight="600"
                >
                  Checkout →
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  color="red.300"
                  onClick={() => { dispatch(clearCart()); }}
                  borderRadius="full"
                >
                  Clear Cart
                </Button>
              </VStack>
            </Box>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
