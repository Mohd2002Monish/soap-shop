import { useState, useEffect } from "react";
import {
  Box, Container, Heading, Flex, VStack, FormControl,
  FormLabel, Input, Button, Text, Divider, useToast,
  SimpleGrid, Badge
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "../api/order.api.js";
import { clearCart } from "../store/slices/cartSlice.js";
import { getGuestId } from "../utils/guestSession.js";
import axiosInstance from "../api/axiosInstance.js";

// ——— LOCKED DEFAULTS (you can change these) ———
const DEFAULT_CITY    = "Moradabad";
const DEFAULT_PINCODE = "244001";
const DEFAULT_STATE   = "Uttar Pradesh";
const DEFAULT_PAYMENT = "COD";

const CheckoutPage = () => {
  const { items } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const guestId = getGuestId();

  const [address, setAddress] = useState({
    name: userInfo?.name || "",
    phone: userInfo?.phone || "",
    street: "",
    city: DEFAULT_CITY,
    state: DEFAULT_STATE,
    pincode: DEFAULT_PINCODE,
  });
  const [syncId, setSyncId] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch latest profile to get saved phone + addresses
  useEffect(() => {
    if (!userInfo) return;
    axiosInstance.get("/auth/me").then(({ data }) => {
      const savedAddress = data.addresses?.find(a => a.isDefault) || data.addresses?.[0];
      setAddress(prev => ({
        ...prev,
        name: data.name || prev.name,
        phone: data.phone || prev.phone,
        street: savedAddress?.street || prev.street,
      }));
    }).catch(() => {});
  }, [userInfo]);

  const itemsTotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCharge = itemsTotal >= 500 ? 0 : 50;
  const grandTotal = itemsTotal + shippingCharge;

  const { mutate, isPending } = useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      dispatch(clearCart());
      navigate(`/order-success/${data._id}`);
    },
    onError: (error) => {
      toast({
        title: "Couldn't place order",
        description: error.response?.data?.message || "Please try again",
        status: "error", duration: 3000, isClosable: true,
      });
    }
  });

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.street) {
      toast({ title: "Fill in all required fields", status: "warning", duration: 2000 });
      return;
    }
    const orderData = {
      items: items.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      shippingAddress: address,
      paymentMethod: "COD",
      itemsTotal, shippingCharge, discount: 0, grandTotal, notes,
      guestId: !userInfo ? guestId : undefined,
      syncId: syncId || undefined,
    };
    mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center" flexDir="column" gap={4}>
        <Text fontSize="5xl">🛒</Text>
        <Text fontFamily="'Playfair Display', serif" fontSize="2xl">Your cart is empty</Text>
        <Button onClick={() => navigate("/")} style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white", borderRadius: "50px" }}>
          Go Back to Shop
        </Button>
      </Box>
    );
  }

  return (
    <Box bg="var(--cream)" minH="100vh" py={{ base: 6, md: 12 }}>
      <Container maxW="1100px" px={{ base: 4, md: 6 }}>
        <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" mb={{ base: 5, md: 8 }}>
          Checkout 🛍️
        </Text>

        <form onSubmit={submitHandler}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 5, lg: 8 }}>
            {/* LEFT — Details Form */}
            <VStack spacing={6} align="stretch">
              {/* Guest notice */}
              {!userInfo && (
                <Box bg="rgba(205,180,219,0.15)" border="1px solid rgba(205,180,219,0.4)" borderRadius="16px" p={4}>
                  <Text fontSize="sm" fontWeight="700" mb={1} color="var(--lavender-dark)">
                    🔒 Checking out as Guest
                  </Text>
                  <Text fontSize="xs" color="gray.500" mb={3}>
                    Your session ID is: <Text as="span" fontWeight="700" fontFamily="monospace">{guestId}</Text>
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Already have an account? Enter your login ID below to link this order.
                  </Text>
                  <Input
                    mt={2}
                    size="sm"
                    placeholder="Paste your session ID to sync (optional)"
                    value={syncId}
                    onChange={(e) => setSyncId(e.target.value)}
                    borderRadius="full"
                    bg="white"
                    fontSize="xs"
                  />
                </Box>
              )}

              <Box bg="white" borderRadius="20px" p={6} border="1px solid rgba(232,180,184,0.2)">
                <Text fontFamily="'Playfair Display', serif" fontSize="xl" fontWeight="700" mb={5}>
                  Delivery Details
                </Text>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600">Full Name</FormLabel>
                    <Input
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      borderRadius="full"
                      bg="rgba(232,180,184,0.05)"
                      border="1.5px solid rgba(232,180,184,0.3)"
                      _focus={{ borderColor: "var(--pink)", bg: "white" }}
                      placeholder="Your full name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600">Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      borderRadius="full"
                      bg="rgba(232,180,184,0.05)"
                      border="1.5px solid rgba(232,180,184,0.3)"
                      _focus={{ borderColor: "var(--pink)", bg: "white" }}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="600">Street Address</FormLabel>
                    <Input
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      borderRadius="full"
                      bg="rgba(232,180,184,0.05)"
                      border="1.5px solid rgba(232,180,184,0.3)"
                      _focus={{ borderColor: "var(--pink)", bg: "white" }}
                      placeholder="Flat no., Building, Street..."
                    />
                  </FormControl>

                  {/* Disabled fields — user sets default values */}
                  <Flex gap={3} w="full">
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.400">City</FormLabel>
                      <Input
                        name="city"
                        value={address.city}
                        isDisabled
                        borderRadius="full"
                        bg="rgba(0,0,0,0.03)"
                        border="1.5px solid rgba(0,0,0,0.1)"
                        color="gray.400"
                        fontSize="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="600" color="gray.400">Pincode</FormLabel>
                      <Input
                        name="pincode"
                        value={address.pincode}
                        isDisabled
                        borderRadius="full"
                        bg="rgba(0,0,0,0.03)"
                        border="1.5px solid rgba(0,0,0,0.1)"
                        color="gray.400"
                        fontSize="sm"
                      />
                    </FormControl>
                  </Flex>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color="gray.400">State</FormLabel>
                    <Input
                      name="state"
                      value={address.state}
                      isDisabled
                      borderRadius="full"
                      bg="rgba(0,0,0,0.03)"
                      border="1.5px solid rgba(0,0,0,0.1)"
                      color="gray.400"
                      fontSize="sm"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600">Order Notes (Optional)</FormLabel>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      borderRadius="full"
                      bg="rgba(232,180,184,0.05)"
                      border="1.5px solid rgba(232,180,184,0.3)"
                      _focus={{ borderColor: "var(--pink)", bg: "white" }}
                      placeholder="E.g., leave at the door..."
                    />
                  </FormControl>
                </VStack>
              </Box>

              {/* Payment Method (disabled) */}
              <Box bg="rgba(205,180,219,0.1)" border="1px solid rgba(205,180,219,0.3)" borderRadius="16px" p={4}>
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontWeight="700" fontSize="sm">💰 Cash on Delivery</Text>
                    <Text fontSize="xs" color="gray.400" mt={1}>Pay when your order arrives at your door</Text>
                  </Box>
                  <Badge bg="linear-gradient(135deg,#E8B4B8,#CDB4DB)" color="white" borderRadius="full" px={3} py={1} fontSize="xs">
                    Selected
                  </Badge>
                </Flex>
              </Box>
            </VStack>

            {/* RIGHT — Order Summary */}
            <Box>
              <Box bg="white" borderRadius={{ base: "16px", md: "20px" }} p={{ base: 5, md: 6 }} border="1px solid rgba(232,180,184,0.2)" position={{ base: "static", lg: "sticky" }} top={{ lg: "100px" }}>
                <Text fontFamily="'Playfair Display', serif" fontSize="xl" fontWeight="700" mb={5}>
                  Order Summary
                </Text>
                <VStack spacing={3} align="stretch" mb={4}>
                  {items.map(item => (
                    <Flex key={item._id} justify="space-between" fontSize="sm">
                      <Text color="gray.600" noOfLines={1} maxW="200px">
                        {item.name} × {item.quantity}
                      </Text>
                      <Text fontWeight="600">₹{item.price * item.quantity}</Text>
                    </Flex>
                  ))}
                </VStack>
                <Divider borderColor="rgba(232,180,184,0.2)" mb={4} />
                <VStack spacing={2} mb={4}>
                  <Flex justify="space-between" w="full" fontSize="sm">
                    <Text color="gray.400">Items Total</Text>
                    <Text>₹{itemsTotal}</Text>
                  </Flex>
                  <Flex justify="space-between" w="full" fontSize="sm">
                    <Text color="gray.400">Shipping</Text>
                    <Text color={shippingCharge === 0 ? "green.400" : "gray.700"}>
                      {shippingCharge === 0 ? "Free 🎉" : `₹${shippingCharge}`}
                    </Text>
                  </Flex>
                  {shippingCharge > 0 && (
                    <Text fontSize="xs" color="gray.300" textAlign="right">
                      Add ₹{500 - itemsTotal} more for free shipping
                    </Text>
                  )}
                </VStack>
                <Divider borderColor="rgba(232,180,184,0.2)" mb={4} />
                <Flex justify="space-between" fontWeight="800" fontSize="lg" mb={6}>
                  <Text>Grand Total</Text>
                  <Text style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    ₹{grandTotal}
                  </Text>
                </Flex>
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  borderRadius="full"
                  style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
                  transition="all 0.3s ease"
                  fontWeight="700"
                  isLoading={isPending}
                  loadingText="Placing Order..."
                >
                  Place Order ✨
                </Button>
                <Text fontSize="xs" color="gray.300" textAlign="center" mt={3}>
                  By ordering, you agree to our Terms & Privacy Policy
                </Text>
              </Box>
            </Box>
          </SimpleGrid>
        </form>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
