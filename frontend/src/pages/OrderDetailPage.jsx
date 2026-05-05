import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box, Container, Text, Button, Flex, VStack, SimpleGrid,
  Badge, Divider, Spinner, Center, Image, useToast
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrderDetails } from "../hooks/useOrders.js";
import { cancelOrder } from "../api/order.api.js";

const statusColor = { pending: "yellow", confirmed: "blue", processing: "purple", shipped: "cyan", delivered: "green", cancelled: "red" };
const statusEmoji = { pending: "⏳", confirmed: "✅", processing: "🔧", shipped: "🚚", delivered: "🎉", cancelled: "❌" };

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrderDetails(id);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate: cancelMutate, isPending: isCancelling } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast({ title: "Order cancelled ✓", status: "success", duration: 2000 });
      queryClient.invalidateQueries(["order", id]);
    },
    onError: (err) => toast({ title: "Couldn't cancel", description: err.response?.data?.message, status: "error" })
  });

  if (isLoading) return <Center minH="60vh"><Spinner size="xl" color="var(--pink)" thickness="3px" /></Center>;
  if (error || !order) return (
    <Center minH="60vh" flexDir="column" gap={4}>
      <Text fontSize="4xl">😔</Text>
      <Text fontFamily="'Playfair Display', serif" fontSize="xl">Order not found</Text>
      <Button as={RouterLink} to="/profile" borderRadius="full" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}>
        Back to Profile
      </Button>
    </Center>
  );

  const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentStep = order.status === "cancelled" ? -1 : statusSteps.indexOf(order.status);

  return (
    <Box bg="var(--cream)" minH="100vh" py={10}>
      <Container maxW="1000px">
        <Button as={RouterLink} to="/profile" variant="ghost" mb={6} borderRadius="full" color="gray.400" fontSize="sm" _hover={{ color: "var(--pink-dark)" }}>
          ← Back to Orders
        </Button>

        <Flex justify="space-between" align="flex-start" mb={6} wrap="wrap" gap={4}>
          <Box>
            <Text fontFamily="'Playfair Display', serif" fontSize="2xl" fontWeight="700">{order.orderNumber}</Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </Box>
          <Badge
            colorScheme={statusColor[order.status] || "gray"}
            borderRadius="full" px={4} py={2} fontSize="sm" fontWeight="700" h="fit-content"
          >
            {statusEmoji[order.status]} {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </Badge>
        </Flex>

        {/* Status Progress */}
        {order.status !== "cancelled" && (
          <Box bg="white" borderRadius="20px" p={5} mb={6} border="1px solid rgba(232,180,184,0.15)">
            <Text fontSize="xs" fontWeight="700" color="var(--pink-dark)" mb={4}>ORDER PROGRESS</Text>
            <Flex align="center" gap={0}>
              {statusSteps.map((step, idx) => (
                <Box key={step} flex={1} display="flex" alignItems="center" flexDir="column">
                  <Flex align="center" w="full">
                    <Box
                      w={6} h={6} borderRadius="full" flexShrink={0} zIndex={1}
                      style={{
                        background: idx <= currentStep ? "linear-gradient(135deg,#E8B4B8,#CDB4DB)" : "rgba(232,180,184,0.2)",
                      }}
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      {idx <= currentStep && <Text color="white" fontSize="10px" fontWeight="800">✓</Text>}
                    </Box>
                    {idx < statusSteps.length - 1 && (
                      <Box flex={1} h="2px" style={{ background: idx < currentStep ? "linear-gradient(135deg,#E8B4B8,#CDB4DB)" : "rgba(232,180,184,0.2)" }} />
                    )}
                  </Flex>
                  <Text fontSize="9px" fontWeight="600" color={idx <= currentStep ? "var(--pink-dark)" : "gray.300"} mt={2} textTransform="capitalize">{step}</Text>
                </Box>
              ))}
            </Flex>
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
          {/* Left — Items + Shipping */}
          <Box gridColumn={{ lg: "span 2" }}>
            {/* Order Items */}
            <Box bg="white" borderRadius="20px" p={5} mb={5} border="1px solid rgba(232,180,184,0.15)">
              <Text fontFamily="'Playfair Display', serif" fontSize="lg" fontWeight="700" mb={4}>Order Items</Text>
              <VStack spacing={4} align="stretch">
                {order.items?.map((item, idx) => (
                  <Box key={idx}>
                    <Flex align="center" gap={4}>
                      <Image
                        src={item.image || `https://placehold.co/80x80/E8B4B8/white?text=🧼`}
                        alt={item.name} w="70px" h="70px" borderRadius="14px" objectFit="cover" flexShrink={0}
                        border="1px solid rgba(232,180,184,0.2)"
                      />
                      <Box flex={1}>
                        <Text fontWeight="600" fontSize="sm">{item.name}</Text>
                        <Text fontSize="xs" color="gray.400" mt={0.5}>₹{item.price} × {item.quantity}</Text>
                      </Box>
                      <Text fontWeight="700" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        ₹{item.price * item.quantity}
                      </Text>
                    </Flex>
                    {idx < order.items.length - 1 && <Divider mt={4} borderColor="rgba(232,180,184,0.15)" />}
                  </Box>
                ))}
              </VStack>
            </Box>

            {/* Shipping Info */}
            <Box bg="white" borderRadius="20px" p={5} border="1px solid rgba(232,180,184,0.15)">
              <Text fontFamily="'Playfair Display', serif" fontSize="lg" fontWeight="700" mb={4}>Delivery Address</Text>
              <VStack align="stretch" spacing={2} fontSize="sm">
                {[
                  ["👤 Name", order.shippingAddress?.name],
                  ["📱 Phone", order.shippingAddress?.phone],
                  ["📍 Address", `${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`],
                ].map(([label, value]) => (
                  <Flex key={label} gap={2} align="flex-start">
                    <Text color="var(--pink-dark)" fontWeight="600" minW="80px" fontSize="xs">{label}</Text>
                    <Text color="gray.600">{value}</Text>
                  </Flex>
                ))}
              </VStack>
              {order.notes && (
                <Box mt={4} p={3} bg="rgba(232,180,184,0.08)" borderRadius="12px">
                  <Text fontSize="xs" color="gray.500"><strong>Notes:</strong> {order.notes}</Text>
                </Box>
              )}
            </Box>
          </Box>

          {/* Right — Summary */}
          <Box>
            <Box bg="white" borderRadius="20px" p={5} border="1px solid rgba(232,180,184,0.15)" position="sticky" top="100px">
              <Text fontFamily="'Playfair Display', serif" fontSize="lg" fontWeight="700" mb={4}>Summary</Text>
              <VStack spacing={3} align="stretch" mb={4} fontSize="sm">
                <Flex justify="space-between"><Text color="gray.400">Items</Text><Text>₹{order.itemsTotal}</Text></Flex>
                <Flex justify="space-between"><Text color="gray.400">Shipping</Text><Text>{order.shippingCharge === 0 ? "Free 🎉" : `₹${order.shippingCharge}`}</Text></Flex>
                {order.discount > 0 && <Flex justify="space-between"><Text color="gray.400">Discount</Text><Text color="green.500">-₹{order.discount}</Text></Flex>}
              </VStack>
              <Divider borderColor="rgba(232,180,184,0.2)" mb={4} />
              <Flex justify="space-between" fontWeight="800" fontSize="lg" mb={4}>
                <Text>Total</Text>
                <Text style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>₹{order.grandTotal}</Text>
              </Flex>

              {/* Payment */}
              <Box p={3} borderRadius="12px" bg={order.paymentStatus === "received" ? "rgba(72,187,120,0.1)" : "rgba(246,173,85,0.1)"} mb={4}>
                <Text fontSize="xs" fontWeight="700" color={order.paymentStatus === "received" ? "green.600" : "orange.500"}>
                  {order.paymentStatus === "received" ? "✓ Payment Received" : "💰 Cash on Delivery"}
                </Text>
              </Box>

              {order.status === "pending" && (
                <Button
                  w="full" borderRadius="full" variant="outline"
                  borderColor="red.200" color="red.400" fontSize="sm"
                  _hover={{ bg: "rgba(245,101,101,0.05)", borderColor: "red.400" }}
                  isLoading={isCancelling}
                  onClick={() => {
                    if (window.confirm("Cancel this order?")) cancelMutate(order._id);
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default OrderDetailPage;
