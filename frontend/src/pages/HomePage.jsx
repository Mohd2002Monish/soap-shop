import { useState, useEffect } from "react";
import {
  Box, Container, Flex, Text, Button, SimpleGrid,
  Image, VStack, HStack, Badge, Spinner, Center, useToast
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { addItem } from "../store/slices/cartSlice.js";
import axiosInstance from "../api/axiosInstance.js";
import { benefits, testimonials } from "../utils/soapData.js";

// ——— Soap Card ———
const SoapCard = ({ soap }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("about");

  const imageUrl = soap.images?.[0]?.url || `https://placehold.co/600x600/E8B4B8/white?text=${encodeURIComponent(soap.name)}`;

  const addToCartHandler = () => {
    dispatch(addItem({
      _id: soap._id,
      name: soap.name,
      price: soap.discountPrice || soap.price,
      image: imageUrl,
      quantity: 1,
      stock: soap.stock,
    }));
    toast({
      title: `${soap.name} added! 🛒`,
      status: "success",
      duration: 1800,
      isClosable: true,
      position: "top-right",
    });
  };

  const tabs = [
    { key: "about", label: "About", content: soap.description },
    { key: "use", label: "How to Use", content: soap.howToUse || "Work into a rich lather with wet hands, apply to damp skin in circular motions, leave for 30 seconds, rinse thoroughly. Use daily for best results." },
    { key: "skin", label: "Skin Type", content: soap.skinType || (soap.category?.name ? `Best for: ${soap.category.name} skin needs.` : "Suitable for most skin types.") },
  ];

  return (
    <Box className="soap-card" cursor="pointer">
      {/* Image — clickable */}
      <RouterLink to={`/product/${soap.slug}`}>
        <Box position="relative" h="260px" overflow="hidden">
          <Image src={imageUrl} alt={soap.name} w="full" h="full" objectFit="cover" />
          {soap.discountPrice && (
            <Badge
              position="absolute" top={3} left={3}
              style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }}
              color="white" borderRadius="full" px={3} py={1} fontSize="xs" fontWeight="700"
            >
              SALE
            </Badge>
          )}
          <Badge
            position="absolute" top={3} right={3}
            bg="rgba(255,248,242,0.9)" color="var(--brown)"
            borderRadius="full" px={2} py={1} fontSize="xs"
          >
            {soap.weight || "100g"}
          </Badge>
          <Box
            position="absolute" bottom={0} left={0} right={0}
            bg="linear-gradient(to top, rgba(58,46,46,0.65), transparent)"
            p={3} pt={8}
          >
            <HStack>
              <Text color="white" fontSize="xs">⭐ {soap.ratings?.average || "4.8"}</Text>
              {soap.scent && <Text color="rgba(255,255,255,0.6)" fontSize="xs">· {soap.scent}</Text>}
            </HStack>
          </Box>
        </Box>
      </RouterLink>

      {/* Content */}
      <Box p={5}>
        <RouterLink to={`/product/${soap.slug}`}>
          <Text fontFamily="'Playfair Display', serif" fontSize="lg" fontWeight="700" mb={1} _hover={{ color: "var(--pink-dark)" }} transition="color 0.2s">
            {soap.name}
          </Text>
        </RouterLink>
        <Text fontSize="xs" color="gray.400" mb={3} fontStyle="italic" noOfLines={1}>
          {soap.shortDescription}
        </Text>

        {/* Tabs */}
        <HStack spacing={0} mb={3} borderBottom="1px solid rgba(232,180,184,0.2)">
          {tabs.map(tab => (
            <Button
              key={tab.key}
              size="xs" variant="ghost" borderRadius="none"
              px={3} pb={2} fontSize="xs"
              fontWeight={activeTab === tab.key ? "700" : "400"}
              color={activeTab === tab.key ? "var(--pink-dark)" : "gray.400"}
              borderBottom={activeTab === tab.key ? "2px solid var(--pink)" : "2px solid transparent"}
              onClick={() => setActiveTab(tab.key)}
              transition="all 0.2s"
            >
              {tab.label}
            </Button>
          ))}
        </HStack>

        <Text fontSize="xs" color="gray.500" lineHeight="1.7" minH="56px" noOfLines={3}>
          {tabs.find(t => t.key === activeTab)?.content}
        </Text>

        {soap.ingredients && (
          <Text fontSize="10px" color="gray.300" mt={2} noOfLines={1}>
            Key: {soap.ingredients.split(",").slice(0, 3).join(", ")}…
          </Text>
        )}

        {/* Price + CTA */}
        <Flex align="center" justify="space-between" mt={4}>
          <Box>
            <Text fontWeight="800" fontSize="xl" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ₹{soap.discountPrice || soap.price}
            </Text>
            {soap.discountPrice && (
              <Text fontSize="xs" textDecoration="line-through" color="gray.300">₹{soap.price}</Text>
            )}
          </Box>
          <Button
            size="sm"
            style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white", borderRadius: "50px" }}
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(232,180,184,0.4)" }}
            transition="all 0.3s ease"
            onClick={addToCartHandler}
            isDisabled={soap.stock === 0}
            px={5} fontWeight="600" fontSize="sm"
          >
            {soap.stock === 0 ? "Sold Out" : "Add to Cart"}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

// ——— Hero ———
const Hero = ({ firstImage }) => (
  <Box position="relative" minH={{ base: "auto", md: "92vh" }} overflow="hidden" display="flex" alignItems="center">
    <Box className="blob-decoration" w={{ base: "280px", md: "600px" }} h={{ base: "280px", md: "600px" }} bg="rgba(232,180,184,0.15)" top="-80px" right="-80px" />
    <Box className="blob-decoration" w={{ base: "200px", md: "400px" }} h={{ base: "200px", md: "400px" }} bg="rgba(205,180,219,0.12)" bottom="-40px" left="-60px" style={{ animationDelay: "3s" }} />

    <Container maxW="1200px" py={{ base: 8, md: 20 }} px={{ base: 4, md: 8 }} position="relative" zIndex={1}>
      <Flex direction={{ base: "column", lg: "row" }} align="center" gap={{ base: 6, lg: 12 }}>
        {/* Mobile floating image — shown above text on small screens */}
        {firstImage && (
          <Box display={{ base: "flex", lg: "none" }} justifyContent="center" w="full">
            <Box
              className="float-small"
              w={{ base: "180px", sm: "220px" }}
              h={{ base: "180px", sm: "220px" }}
              borderRadius="60% 40% 30% 70% / 60% 30% 70% 40%"
              overflow="hidden"
              boxShadow="0 16px 50px rgba(232,180,184,0.35)"
              style={{ animation: "scaleIn 0.7s 0.2s ease both" }}
            >
              <Image src={firstImage} w="full" h="full" objectFit="cover" />
            </Box>
          </Box>
        )}

        <Box flex={1} animation="fadeUp 0.8s ease forwards" textAlign={{ base: "center", lg: "left" }}>
          <Text className="section-tag" mb={3} style={{ animation: "fadeUp 0.6s 0.1s ease both", opacity: 0, animationFillMode: "forwards" }}>✨ Pure · Natural · Handcrafted</Text>
          <Text
            fontFamily="'Playfair Display', serif"
            fontSize={{ base: "2rem", sm: "2.6rem", md: "4.5rem" }}
            fontWeight="700"
            lineHeight={{ base: "1.2", md: "1.15" }}
            mb={4}
            style={{ animation: "fadeUp 0.7s 0.2s ease both", opacity: 0, animationFillMode: "forwards" }}
          >
            Soaps that actually{" "}
            <Text as="span" display="inline" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              love you back
            </Text>
          </Text>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            color="gray.500" mb={6}
            maxW={{ base: "100%", lg: "480px" }}
            lineHeight="1.9"
            mx={{ base: "auto", lg: 0 }}
            style={{ animation: "fadeUp 0.7s 0.35s ease both", opacity: 0, animationFillMode: "forwards" }}
          >
            Sterling Botanica handcrafts small-batch, plant-powered soaps designed for real skin results.
            No fillers. No shortcuts. Just pure botanical goodness.
          </Text>
          <Flex gap={3} wrap="wrap" justify={{ base: "center", lg: "flex-start" }} style={{ animation: "fadeUp 0.7s 0.5s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <Button
              as="a" href="#products"
              size={{ base: "md", md: "lg" }}
              style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white", borderRadius: "50px" }}
              _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
              _active={{ transform: "scale(0.97)" }}
              transition="all 0.3s ease" fontWeight="700"
              px={{ base: 6, md: 8 }}
              minH="44px"
            >
              Shop All Soaps ✨
            </Button>
            <Button
              as="a" href="#about"
              size={{ base: "md", md: "lg" }} variant="outline"
              borderColor="var(--pink)" color="var(--pink-dark)"
              borderRadius="50px" px={{ base: 5, md: 8 }}
              _hover={{ bg: "rgba(232,180,184,0.1)", transform: "translateY(-2px)" }}
              _active={{ transform: "scale(0.97)" }}
              transition="all 0.3s ease"
              minH="44px"
            >
              Our Story
            </Button>
          </Flex>
          <Flex
            gap={{ base: 5, md: 10 }}
            mt={{ base: 7, md: 10 }}
            justify={{ base: "center", lg: "flex-start" }}
          >
            {[["6", "Botanical Soaps"], ["100%", "Natural"], ["0", "Harsh Chemicals"]].map(([num, label], i) => (
              <Box key={label} className="hero-stat" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
                <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="800" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{num}</Text>
                <Text fontSize={{ base: "10px", md: "xs" }} color="gray.400" fontWeight="500">{label}</Text>
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Floating hero image — desktop only */}
        {firstImage && (
          <Box flex={1} display={{ base: "none", lg: "block" }} textAlign="center" style={{ animation: "slideInRight 0.9s 0.3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <Box position="relative" display="inline-block">
              <Box className="float" w="380px" h="380px" borderRadius="60% 40% 30% 70% / 60% 30% 70% 40%" overflow="hidden" boxShadow="0 30px 80px rgba(232,180,184,0.35)" mx="auto">
                <Image src={firstImage} w="full" h="full" objectFit="cover" />
              </Box>
              <Box className="float" position="absolute" bottom="-20px" right="-30px" w="130px" h="130px" borderRadius="50%" overflow="hidden" boxShadow="0 15px 40px rgba(205,180,219,0.3)" style={{ animationDelay: "1.5s" }}>
                <Image src={firstImage} w="full" h="full" objectFit="cover" filter="hue-rotate(20deg)" />
              </Box>
            </Box>
          </Box>
        )}
      </Flex>
    </Container>
  </Box>
);

// ——— Ticker ———
const Ticker = () => {
  const items = ["🌿 100% Natural", "🤲 Handcrafted in Small Batches", "🐰 Cruelty Free", "✨ Dermatologist Tested", "🌍 Eco Packaging", "🧼 Sterling Botanica"];
  return (
    <Box className="ticker-wrap">
      <Box className="ticker">
        {[...items, ...items].map((item, i) => <Text key={i} className="ticker-item">{item}</Text>)}
      </Box>
    </Box>
  );
};

// ——— Benefits ———
const BenefitsSection = () => (
  <Box id="benefits" py={{ base: 14, md: 20 }} bg="white">
    <Container maxW="1200px" px={{ base: 4, md: 8 }}>
      <VStack mb={{ base: 10, md: 14 }} spacing={3} textAlign="center">
        <Text className="section-tag">Why Sterling Botanica</Text>
        <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "xl", md: "4xl" }} fontWeight="700">
          Not your average soap brand 💅
        </Text>
      </VStack>
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 3, md: 6 }}>
        {benefits.map((b, i) => (
          <Box
            key={i}
            className="benefit-card"
            p={{ base: 4, md: 6 }}
            borderRadius={{ base: "16px", md: "24px" }}
            border="1px solid rgba(232,180,184,0.15)"
            _hover={{ transform: "translateY(-5px) scale(1.02)", boxShadow: "0 14px 32px rgba(232,180,184,0.22)", borderColor: "rgba(232,180,184,0.4)" }}
            transition="all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)" textAlign="center"
          >
            <Text fontSize={{ base: "2xl", md: "3xl" }} mb={2} style={{ display: "block", animation: `wiggle 3s ${i * 0.4}s ease-in-out infinite` }}>{b.icon}</Text>
            <Text fontWeight="700" mb={1} fontSize={{ base: "xs", md: "sm" }}>{b.title}</Text>
            <Text fontSize={{ base: "10px", md: "xs" }} color="gray.400" lineHeight="1.7" display={{ base: "none", sm: "block" }}>{b.desc}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

// ——— About ———
const AboutSection = ({ sampleImage }) => (
  <Box id="about" py={20} position="relative" overflow="hidden">
    <Box className="blob-decoration" w="400px" h="400px" bg="rgba(205,180,219,0.1)" top="0" right="-100px" />
    <Container maxW="1200px">
      <Flex direction={{ base: "column", md: "row" }} gap={14} align="center">
        <Box flex={1}>
          <Box borderRadius="30px" overflow="hidden" boxShadow="0 20px 60px rgba(232,180,184,0.25)">
            <Image
              src={sampleImage || "https://placehold.co/600x500/E8B4B8/white?text=Sterling+Botanica"}
              w="full" h="420px" objectFit="cover"
            />
          </Box>
        </Box>
        <Box flex={1}>
          <Text className="section-tag" mb={4}>Our Story</Text>
          <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" mb={5} lineHeight="1.3">
            Born from a passion for{" "}
            <Text as="span" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              real botanicals
            </Text>
          </Text>
          <Text color="gray.500" mb={4} lineHeight="1.9" fontSize="sm">
            Sterling Botanica was born from a simple frustration — reading soap labels that were more chemistry class than skincare. We believed you deserved better.
          </Text>
          <Text color="gray.500" mb={6} lineHeight="1.9" fontSize="sm">
            Each of our 6 soaps is formulated around a specific skin need, crafted by hand in small batches using botanically-sourced, pure ingredients. Every bar is unique, every formula intentional.
          </Text>
          <HStack spacing={3} flexWrap="wrap">
            {["Cold Process Method", "72hr Curing", "pH Balanced", "No Sulfates"].map(tag => (
              <Badge key={tag} bg="rgba(232,180,184,0.15)" color="var(--pink-dark)" borderRadius="full" px={3} py={1} fontWeight="600" fontSize="xs">
                ✓ {tag}
              </Badge>
            ))}
          </HStack>
        </Box>
      </Flex>
    </Container>
  </Box>
);

// ——— Testimonials ———
const TestimonialsSection = () => (
  <Box py={20} bg="white">
    <Container maxW="1200px">
      <VStack mb={14} spacing={3} textAlign="center">
        <Text className="section-tag">Customer Love</Text>
        <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700">
          The people have spoken 🗣️
        </Text>
      </VStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
        {testimonials.map((t, i) => (
          <Box key={i} className="testimonial-card" p={5}>
            <Text className="stars" fontSize="sm" mb={3}>{"★".repeat(t.rating)}</Text>
            <Text fontSize="sm" color="gray.600" lineHeight="1.7" mb={4} fontStyle="italic">"{t.text}"</Text>
            <Box borderTop="1px solid rgba(232,180,184,0.2)" pt={3}>
              <Flex align="center" gap={2}>
                <Box w={8} h={8} borderRadius="full" style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)" }} display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="xs" color="white" fontWeight="700">{t.name[0]}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="700">{t.name}</Text>
                  <Text fontSize="10px" color="gray.400">{t.handle}</Text>
                </Box>
              </Flex>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

// ——— Main Page ———
const HomePage = () => {
  const [soaps, setSoaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products?limit=6");
        setSoaps(data.products || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const firstImage = soaps[0]?.images?.[0]?.url;
  const aboutImage = soaps[3]?.images?.[0]?.url;

  return (
    <Box>
      <Hero firstImage={firstImage} />
      <Ticker />

      {/* Products */}
      <Box id="products" py={{ base: 12, md: 20 }}>
        <Container maxW="1200px" px={{ base: 3, md: 8 }}>
          <VStack mb={{ base: 8, md: 12 }} spacing={3} textAlign="center">
            <Text className="section-tag">Our Collection</Text>
            <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "xl", md: "4xl" }} fontWeight="700">
              Six soaps. Six skin stories. 🌸
            </Text>
            <Text color="gray.400" maxW="500px" fontSize={{ base: "xs", md: "sm" }}>
              Each bar is designed around one specific skin need — find yours.
            </Text>
          </VStack>

          {loading ? (
            <Center py={20}><Spinner size="xl" color="var(--pink)" thickness="3px" /></Center>
          ) : soaps.length === 0 ? (
            <Center py={10}><Text color="gray.400">No products found. Check back soon!</Text></Center>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
              {soaps.map(soap => <SoapCard key={soap._id} soap={soap} />)}
            </SimpleGrid>
          )}
        </Container>
      </Box>

      <BenefitsSection />
      <AboutSection sampleImage={aboutImage} />
      <TestimonialsSection />

      {/* Final CTA */}
      <Box py={20} textAlign="center" position="relative" overflow="hidden">
        <Box className="blob-decoration" w="500px" h="500px" bg="rgba(232,180,184,0.1)" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
        <Container maxW="600px" position="relative" zIndex={1}>
          <Text fontFamily="'Playfair Display', serif" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" mb={4}>
            Ready for your glow up? ✨
          </Text>
          <Text color="gray.400" mb={8} fontSize="sm" lineHeight="1.8">
            Join hundreds of customers who've switched to Sterling Botanica and never looked back.
          </Text>
          <Button
            as="a" href="#products" size="lg"
            style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white", borderRadius: "50px" }}
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
            transition="all 0.3s ease" px={10} fontWeight="700"
          >
            Shop Sterling Botanica
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
