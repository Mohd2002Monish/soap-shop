import { useState } from "react";
import {
  Box, Container, Text, Button, VStack, FormControl,
  FormLabel, Input, useToast, Divider
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { register } from "../api/auth.api.js";
import { setCredentials } from "../store/slices/authSlice.js";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast({ title: "Account created! Welcome ✨", status: "success", duration: 2000, position: "top-right" });
      navigate(redirect);
    },
    onError: (err) => {
      toast({ title: "Registration failed", description: err.response?.data?.message || "Try again", status: "error", duration: 3000 });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match 😬", status: "error", duration: 2000 });
      return;
    }
    mutate({ name, email, password });
  };

  const inputStyle = {
    borderRadius: "50px",
    bg: "rgba(232,180,184,0.05)",
    border: "1.5px solid rgba(232,180,184,0.3)",
  };

  return (
    <Box minH="100vh" bg="var(--cream)" display="flex" alignItems="center" justifyContent="center" py={12} position="relative" overflow="hidden">
      <Box className="blob-decoration" w="350px" h="350px" bg="rgba(232,180,184,0.12)" top="-80px" left="-80px" />
      <Box className="blob-decoration" w="300px" h="300px" bg="rgba(205,180,219,0.1)" bottom="-60px" right="-60px" style={{ animationDelay: "4s" }} />

      <Container maxW="440px" px={{ base: 4, md: 6 }} position="relative" zIndex={1}>
        <Box bg="white" borderRadius={{ base: "20px", md: "30px" }} p={{ base: 6, md: 10 }} border="1px solid rgba(232,180,184,0.2)" boxShadow="0 20px 60px rgba(232,180,184,0.15)">
          <VStack spacing={2} mb={8} textAlign="center">
            <Text fontSize="3xl">🌸</Text>
            <Text fontFamily="'Playfair Display', serif" fontSize="2xl" fontWeight="700">Join the glow</Text>
            <Text fontSize="sm" color="gray.400">Create your Lather & Bloom account</Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {[
                { label: "Your Name", value: name, setter: setName, type: "text", placeholder: "Priya Sharma" },
                { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "you@example.com" },
                { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Min 6 characters" },
                { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password", placeholder: "••••••••" },
              ].map(({ label, value, setter, type, placeholder }) => (
                <FormControl key={label} isRequired>
                  <FormLabel fontSize="sm" fontWeight="600">{label}</FormLabel>
                  <Input
                    type={type} value={value} onChange={(e) => setter(e.target.value)}
                    {...inputStyle}
                    _focus={{ borderColor: "var(--pink)", bg: "white" }}
                    placeholder={placeholder}
                  />
                </FormControl>
              ))}
              <Button
                type="submit" w="full" size="lg" borderRadius="full"
                style={{ background: "linear-gradient(135deg,#E8B4B8,#CDB4DB)", color: "white" }}
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 35px rgba(232,180,184,0.5)" }}
                transition="all 0.3s ease" fontWeight="700" mt={2} isLoading={isPending}
              >
                Create Account ✨
              </Button>
            </VStack>
          </form>

          <Divider my={6} borderColor="rgba(232,180,184,0.2)" />
          <Text textAlign="center" fontSize="sm" color="gray.400">
            Already have an account?{" "}
            <Text as={RouterLink} to={`/login?redirect=${redirect}`} color="var(--pink-dark)" fontWeight="700" _hover={{ textDecoration: "underline" }}>
              Sign in
            </Text>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
