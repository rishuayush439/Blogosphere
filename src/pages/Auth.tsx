
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm, SignupForm } from "@/components/AuthForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <motion.div 
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="glass-morphism rounded-xl p-8 backdrop-blur-sm bg-background/95">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {activeTab === "login"
                ? "Sign in to your account to continue"
                : "Sign up for a new account to get started"}
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {activeTab === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-primary font-medium hover:underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
