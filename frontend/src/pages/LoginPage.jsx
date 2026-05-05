import { useState } from "react";
import {
  Box, Container, Text, Button, VStack, FormControl,
  FormLabel, Input, useToast, Flex, Divider
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login } from "../api/auth.api.js";
import { setCredentials } from "../store/slices/authSlice.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast({ title: "Welcome back! ✨", status: "success", duration: 2000, position: "top-right" });
      navigate(redirect);
    },
    onError: (err) => {
      toast({ title: "Login failed", description: err.response?.data?.message || "Check your credentials", status: "error", duration: 3000 });
    },
  });

  return (
    <Box minH="100vh" bg="var(--cream)" display="flex" alignItems="center" justifyContent="center" py={12} position="relative" overflow="hidden">
      <Box className="blob-decoration" w="400px" h="400px" bg="rgba(232,180,184,0.12)" top="-100px" right="-100px" />
      <Box className="blob-decoration" w="300px" h="300px" bg="rgba(205,180,219,0.1)" bottom="-80px" left="-80px" style={{ animationDelay: "3s" }} />

      <Container maxW="440px" px={{ base: 4, md: 6 }} position="relative" zIndex={1}>
        <Box bg="white" borderRadius={{ base: "20px", md: "30px" }} p={{ base: 6, md: 10 }} border="1px solid rgba(232,180,184,0.2)" boxShadow="0 20px 60px rgba(232,180,184,0.15)">
          <VStack spacing={2} mb={8} textAlign="center">
            <Text fontSize="3xl">🧼</Text>
            <Text fontFamily="'Playfair Display', serif" fontSize="2xl" fontWeight="700">Welcome back</Text>
            <Text fontSize="sm" color="gray.400">Sign in to your Lather & Bloom account</Text>
          </VStack>

          <form onSubmit={(e) => { e.preventDefault(); mutate({ email, password }); }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Email</FormLabel>
                <Input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  borderRadius="full" bg="rgba(232,180,184,0.05)"
                  border="1.5px solid rgba(232,180,184,0.3)"
                  _focus={{ borderColor: "var(--pink)", bg: "white" }}
                  placeholder="you@example.com"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600">Password</FormLabel>
                <Input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  borderRadius="full" bg="rgba(232,180,184,0.05)"
                  border="1.5px solid rgba(232,180,184,0.3)"
                  _focus={{ borderColor: "var(--pink)", bg: "white" }}
                  placeholder="••••••••"
                />
              </FormControl>
              <Button
                type="submit" w="full" size="lg" borderRadius="full"
                style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
                transition="all 0.3s ease" fontWeight="700" mt={2} isLoading={isPending}
              >
                Sign In ✨
              </Button>
            </VStack>
          </form>

          <Divider my={6} borderColor="rgba(232,180,184,0.2)" />
          <Text textAlign="center" fontSize="sm" color="gray.400">
            New here?{" "}
            <Text as={RouterLink} to={`/register?redirect=${redirect}`} color="var(--pink-dark)" fontWeight="700" _hover={{ textDecoration: "underline" }}>
              Create account
            </Text>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
