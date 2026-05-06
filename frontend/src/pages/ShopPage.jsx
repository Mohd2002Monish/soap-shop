import { useState, useEffect } from "react";
import {
  Box, Container, Text, SimpleGrid, Flex, Input, Select,
  Button, Badge, Spinner, Center, VStack, HStack, InputGroup, InputLeftElement
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../store/slices/cartSlice.js";
import axiosInstance from "../api/axiosInstance.js";
import { useToast } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

const ShopPage = () => {
  const [soaps, setSoaps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axiosInstance.get("/products?limit=20"),
          axiosInstance.get("/categories"),
        ]);
        setSoaps(prodRes.data.products || []);
        setCategories(catRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = soaps
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => selectedCategory ? s.category?._id === selectedCategory || s.category?.slug === selectedCategory : true)
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === "price-high") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sortBy === "rating") return b.ratings?.average - a.ratings?.average;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <Box bg="var(--cream)" minH="100vh">
      {/* Header */}
      <Box py={{ base: 10, md: 16 }} textAlign="center" position="relative" overflow="hidden">
        <Box className="blob-decoration" w="400px" h="400px" bg="rgba(232,180,184,0.12)" top="-100px" right="-80px" />
        <Box className="blob-decoration" w="300px" h="300px" bg="rgba(205,180,219,0.1)" bottom="-50px" left="-50px" style={{ animationDelay: "4s" }} />
        <Container maxW="700px" position="relative" zIndex={1} px={{ base: 4, md: 6 }}>
          <Text className="section-tag" mb={3}>Our Collection</Text>
          <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "2xl", sm: "3xl", md: "5xl" }} fontWeight="700" mb={3}>
            All{" "}
            <Text as="span" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              6 Soaps
            </Text>
          </Text>
          <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>Each bar designed around one specific skin need. Find yours.</Text>
        </Container>
      </Box>

      <Container maxW="1200px" pb={20} px={{ base: 3, md: 6 }}>
        {/* Filters */}
        <Box bg="white" borderRadius={{ base: "16px", md: "20px" }} p={{ base: 3, md: 5 }} mb={{ base: 5, md: 8 }} border="1px solid rgba(232,180,184,0.2)" shadow="sm">
          <Flex gap={3} direction={{ base: "column", sm: "row" }} align="stretch">
            <InputGroup flex={2}>
              <InputLeftElement pointerEvents="none">
                <Text color="gray.300" fontSize="sm">🔍</Text>
              </InputLeftElement>
              <Input
                placeholder="Search soaps..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                borderRadius="full"
                border="1.5px solid rgba(232,180,184,0.3)"
                bg="rgba(232,180,184,0.04)"
                _focus={{ borderColor: "var(--pink)", bg: "white" }}
                pl={10}
                fontSize={{ base: "15px", md: "14px" }}
              />
            </InputGroup>
            <Flex gap={3} flex={2}>
              <Select
                flex={1}
                borderRadius="full"
                border="1.5px solid rgba(232,180,184,0.3)"
                bg="white"
                _focus={{ borderColor: "var(--pink)" }}
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                fontSize={{ base: "14px", md: "14px" }}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
              </Select>
              <Select
                flex={1}
                borderRadius="full"
                border="1.5px solid rgba(232,180,184,0.3)"
                bg="white"
                _focus={{ borderColor: "var(--pink)" }}
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                fontSize={{ base: "14px", md: "14px" }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </Select>
            </Flex>
          </Flex>
        </Box>

        {/* Results */}
        {loading ? (
          <Center py={20}><Spinner size="xl" color="var(--pink)" thickness="3px" /></Center>
        ) : filtered.length === 0 ? (
          <Center py={20} flexDir="column" gap={4}>
            <Text fontSize="4xl">🧼</Text>
            <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "lg", md: "xl" }}>No soaps found</Text>
            <Button onClick={() => { setSearch(""); setSelectedCategory(""); }} variant="outline" borderRadius="full" borderColor="var(--pink)" color="var(--pink-dark)">
              Clear Filters
            </Button>
          </Center>
        ) : (
          <>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400" mb={{ base: 4, md: 6 }}>{filtered.length} soap{filtered.length !== 1 ? "s" : ""} found</Text>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
              {filtered.map(soap => <ShopCard key={soap._id} soap={soap} dispatch={dispatch} toast={toast} />)}
            </SimpleGrid>
          </>
        )}
      </Container>
    </Box>
  );
};

const ShopCard = ({ soap, dispatch, toast }) => {
  const [tab, setTab] = useState("about");
  const imageUrl = soap.images?.[0]?.url || `https://placehold.co/600x600/E8B4B8/white?text=${encodeURIComponent(soap.name)}`;

  const addToCart = () => {
    dispatch(addItem({ _id: soap._id, name: soap.name, price: soap.discountPrice || soap.price, image: imageUrl, quantity: 1, stock: soap.stock }));
    toast({ title: `${soap.name} added! 🛒`, status: "success", duration: 1800, position: "top-right" });
  };

  return (
    <Box className="soap-card">
      <RouterLink to={`/product/${soap.slug}`}>
        <Box position="relative" h="240px" overflow="hidden">
          <Image src={imageUrl} alt={soap.name} w="full" h="full" objectFit="cover" />
          {soap.discountPrice && (
            <Badge position="absolute" top={3} left={3} style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }} color="white" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700">SALE</Badge>
          )}
          <Box position="absolute" bottom={0} left={0} right={0} bg="linear-gradient(to top,rgba(58,46,46,0.6),transparent)" p={3} pt={8}>
            <Text color="white" fontSize="xs">⭐ {soap.ratings?.average || "4.8"} · {soap.scent}</Text>
          </Box>
        </Box>
      </RouterLink>
      <Box p={5}>
        <RouterLink to={`/product/${soap.slug}`}>
          <Text fontFamily="'Playfair Display', serif" fontSize="lg" fontWeight="700" mb={1} _hover={{ color: "var(--pink-dark)" }} transition="color 0.2s">
            {soap.name}
          </Text>
        </RouterLink>
        <Text fontSize="xs" color="gray.400" mb={3} fontStyle="italic">{soap.shortDescription}</Text>
        <HStack spacing={0} mb={3} borderBottom="1px solid rgba(232,180,184,0.2)">
          {[["about","About"],["use","How to Use"],["skin","Skin Type"]].map(([k,l]) => (
            <Button key={k} size="xs" variant="ghost" borderRadius="none" px={3} pb={2} fontSize="xs"
              fontWeight={tab === k ? "700" : "400"} color={tab === k ? "var(--pink-dark)" : "gray.400"}
              borderBottom={tab === k ? "2px solid var(--pink)" : "2px solid transparent"}
              onClick={() => setTab(k)} transition="all 0.2s">{l}</Button>
          ))}
        </HStack>
        <Text fontSize="xs" color="gray.500" lineHeight="1.7" minH="54px" noOfLines={3}>
          {tab === "about" && soap.description}
          {tab === "use" && (soap.howToUse || "Lather between wet palms, apply to damp skin, rinse well. Use daily.")}
          {tab === "skin" && (soap.skinType || soap.category?.name || "Suitable for most skin types.")}
        </Text>
        <Flex align="center" justify="space-between" mt={4}>
          <Box>
            <Text fontWeight="800" fontSize="xl" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ₹{soap.discountPrice || soap.price}
            </Text>
            {soap.discountPrice && <Text fontSize="xs" textDecoration="line-through" color="gray.300">₹{soap.price}</Text>}
          </Box>
          <Button size="sm" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white", borderRadius: "50px" }}
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(232,180,184,0.4)" }}
            transition="all 0.3s ease" onClick={addToCart} isDisabled={soap.stock === 0} px={5} fontWeight="600">
            {soap.stock === 0 ? "Sold Out" : "Add to Cart"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default ShopPage;
