import { useState, useEffect } from "react";
import {
  Box, Container, Text, Flex, Image, Button, Badge,
  SimpleGrid, Spinner, Center, HStack, VStack, Divider, useToast
} from "@chakra-ui/react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../store/slices/cartSlice.js";
import axiosInstance from "../api/axiosInstance.js";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [qty, setQty] = useState(1);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${slug}`);
        setProduct(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  if (loading) return <Center minH="60vh"><Spinner size="xl" color="var(--pink)" thickness="3px" /></Center>;
  if (!product) return (
    <Center minH="60vh" flexDir="column" gap={4}>
      <Text fontSize="4xl">😔</Text>
      <Text fontFamily="'Playfair Display', serif" fontSize="xl">Product not found</Text>
      <Button as={RouterLink} to="/shop" borderRadius="full" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}>Back to Shop</Button>
    </Center>
  );

  const imageUrl = product.images?.[mainImageIdx]?.url || product.images?.[0]?.url || `https://placehold.co/600x600/E8B4B8/white?text=${encodeURIComponent(product.name)}`;

  const addToCartHandler = () => {
    for (let i = 0; i < qty; i++) {
      dispatch(addItem({ _id: product._id, name: product.name, price: product.discountPrice || product.price, image: imageUrl, quantity: 1, stock: product.stock }));
    }
    toast({ title: `${qty}× ${product.name} added to cart 🛒`, status: "success", duration: 2000, position: "top-right" });
  };

  const tabs = [
    { key: "description", label: "Description" },
    { key: "ingredients", label: "Ingredients" },
    { key: "howToUse", label: "How to Use" },
  ];

  return (
    <Box bg="var(--cream)" minH="100vh">
      <Container maxW="1100px" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
        <Button as={RouterLink} to="/shop" variant="ghost" mb={4} borderRadius="full" color="gray.400" fontSize="sm" _hover={{ color: "var(--pink-dark)" }}>
          ← Back to Shop
        </Button>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
          {/* Image Side */}
          <Box>
            <Box
              borderRadius="30px" overflow="hidden"
              boxShadow="0 20px 60px rgba(232,180,184,0.3)"
              border="1px solid rgba(232,180,184,0.2)"
              position="relative"
            >
              <Image src={imageUrl} alt={product.name} w="full" h={{ base: "300px", md: "480px" }} objectFit="cover" />
              {product.discountPrice && (
                <Badge position="absolute" top={4} left={4}
                  style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }}
                  color="white" borderRadius="full" px={4} py={2} fontSize="sm" fontWeight="700">
                  SALE
                </Badge>
              )}
            </Box>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <HStack mt={4} spacing={3} overflowX="auto" pb={2}>
                {product.images.map((img, idx) => (
                  <Box
                    key={idx}
                    cursor="pointer"
                    borderRadius="16px"
                    overflow="hidden"
                    border={mainImageIdx === idx ? "2px solid var(--pink)" : "2px solid transparent"}
                    opacity={mainImageIdx === idx ? 1 : 0.6}
                    transition="all 0.2s"
                    _hover={{ opacity: 1 }}
                    onClick={() => setMainImageIdx(idx)}
                    flexShrink={0}
                  >
                    <Image src={img.url} w="80px" h="80px" objectFit="cover" />
                  </Box>
                ))}
              </HStack>
            )}

            {/* Ingredients mini strip */}
            {product.ingredients && (
              <Box mt={5} p={4} bg="white" borderRadius="16px" border="1px solid rgba(232,180,184,0.15)">
                <Text fontSize="xs" fontWeight="700" color="var(--pink-dark)" mb={2}>KEY INGREDIENTS</Text>
                <Flex wrap="wrap" gap={2}>
                  {product.ingredients.split(",").map(ing => (
                    <Badge key={ing} bg="rgba(232,180,184,0.1)" color="var(--brown)" borderRadius="full" px={3} py={1} fontSize="10px">
                      {ing.trim()}
                    </Badge>
                  ))}
                </Flex>
              </Box>
            )}
          </Box>

          {/* Info Side */}
          <VStack align="stretch" spacing={5}>
            {product.category && (
              <Badge bg="rgba(205,180,219,0.2)" color="var(--lavender-dark)" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="600" w="fit-content">
                {product.category.name}
              </Badge>
            )}

            <Box>
              <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.2">
                {product.name}
              </Text>
              <Text color="gray.400" fontSize="sm" mt={1} fontStyle="italic">{product.shortDescription}</Text>
            </Box>

            {/* Rating */}
            <HStack>
              <Text color="#FFB347" fontSize="md">{"★".repeat(Math.round(product.ratings?.average || 5))}</Text>
              <Text fontSize="xs" color="gray.400">{product.ratings?.average || "4.8"} ({product.ratings?.count || 0} reviews)</Text>
            </HStack>

            {/* Price */}
            <Flex align="baseline" gap={3}>
              <Text fontWeight="900" fontSize="3xl" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ₹{product.discountPrice || product.price}
              </Text>
              {product.discountPrice && (
                <Text textDecoration="line-through" color="gray.300" fontSize="lg">₹{product.price}</Text>
              )}
              {product.discountPrice && (
                <Badge colorScheme="green" borderRadius="full" px={2}>
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </Badge>
              )}
            </Flex>

            {/* Badges */}
            <Flex gap={2} wrap="wrap">
              {product.weight && <Badge bg="rgba(232,180,184,0.15)" color="var(--pink-dark)" borderRadius="full" px={3} py={1} fontSize="xs">⚖️ {product.weight}</Badge>}
              {product.scent && <Badge bg="rgba(205,180,219,0.15)" color="var(--lavender-dark)" borderRadius="full" px={3} py={1} fontSize="xs">🌸 {product.scent}</Badge>}
              <Badge bg={product.stock > 0 ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)"}
                color={product.stock > 0 ? "green.600" : "red.500"} borderRadius="full" px={3} py={1} fontSize="xs">
                {product.stock > 0 ? `✓ In Stock (${product.stock})` : "✗ Sold Out"}
              </Badge>
            </Flex>

            <Divider borderColor="rgba(232,180,184,0.2)" />

            {/* Quantity + Cart */}
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={3}>Quantity</Text>
              <Flex gap={4} align="center" wrap={{ base: "wrap", sm: "nowrap" }}>
                <HStack>
                  <Button size="sm" borderRadius="full" bg="rgba(232,180,184,0.15)" border="none"
                    onClick={() => setQty(q => Math.max(1, q - 1))} _hover={{ bg: "rgba(232,180,184,0.3)" }}>−</Button>
                  <Text fontWeight="700" minW="30px" textAlign="center" fontSize="lg">{qty}</Text>
                  <Button size="sm" borderRadius="full" bg="rgba(232,180,184,0.15)" border="none"
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))} _hover={{ bg: "rgba(232,180,184,0.3)" }}>+</Button>
                </HStack>
                <Button
                  flex={1} size="lg" borderRadius="full"
                  style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
                  _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
                  transition="all 0.3s ease" fontWeight="700"
                  onClick={addToCartHandler} isDisabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Sold Out" : `Add ${qty > 1 ? `${qty}×` : ""} to Cart`}
                </Button>
              </Flex>
            </Box>

            {/* Tabs */}
            <Box bg="white" borderRadius="20px" border="1px solid rgba(232,180,184,0.15)" overflow="hidden">
              <HStack spacing={0} borderBottom="1px solid rgba(232,180,184,0.15)">
                {tabs.map(t => (
                  <Button key={t.key} flex={1} size="sm" variant="ghost" borderRadius="none" py={4}
                    fontWeight={activeTab === t.key ? "700" : "400"}
                    color={activeTab === t.key ? "var(--pink-dark)" : "gray.400"}
                    borderBottom={activeTab === t.key ? "2px solid var(--pink)" : "none"}
                    onClick={() => setActiveTab(t.key)} transition="all 0.2s" fontSize="xs">
                    {t.label}
                  </Button>
                ))}
              </HStack>
              <Box p={5}>
                <Text fontSize="sm" color="gray.600" lineHeight="1.9">
                  {activeTab === "description" && product.description}
                  {activeTab === "ingredients" && (product.ingredients || "Full ingredient list coming soon.")}
                  {activeTab === "howToUse" && (product.howToUse || "Lather between wet palms, apply to damp skin in gentle circular motions, leave for 30 seconds, rinse thoroughly. Use daily for best results.")}
                </Text>
              </Box>
            </Box>

            {/* Trust badges */}
            <SimpleGrid columns={3} spacing={3} mt={2}>
              {[["🌿","100% Natural"],["🐰","Cruelty Free"],["✨","Handcrafted"]].map(([icon, label]) => (
                <Box key={label} textAlign="center" p={3} bg="white" borderRadius="12px" border="1px solid rgba(232,180,184,0.1)">
                  <Text fontSize="xl" mb={1}>{icon}</Text>
                  <Text fontSize="10px" fontWeight="600" color="gray.500">{label}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
